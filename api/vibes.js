import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const handleDatabaseOperation = async (req, res, operation, payload = null) => {
    try {
        let query = supabase.from('daily_vibes');
        
        switch (operation) {
            case 'READ':
                query = query
                    .select("id, affirmation_text, mood_rating, mood_type, created_at")
                    .order("created_at", { ascending: false });
                break;
            case 'CREATE':
                query = query.insert(payload.data).select('*'); 
                break;
            case 'UPDATE':
                query = query.update(payload.data).eq('id', payload.id).select('*'); 
                break;
            case 'DELETE':
                query = query.delete().eq('id', payload.id);
                break;
            default:
                return res.status(400).json({ error: 'Invalid operation' });
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Supabase ${operation} Error:`, error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (e) {
        console.error('Serverless Proxy Error:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


app.get('/', (req, res) => {
    handleDatabaseOperation(req, res, 'READ');
});

app.post('/', (req, res) => {
    const { text, mood, rating, timestamp } = req.body;
    const payload = {
        data: {
            affirmation_text: text,
            mood_rating: rating,
            mood_type: mood,
            created_at: timestamp,
        }
    };
    handleDatabaseOperation(req, res, 'CREATE', payload);
});

app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { text, mood, rating, timestamp } = req.body;
    const payload = {
        id: id,
        data: {
            affirmation_text: text,
            mood_rating: rating,
            mood_type: mood,
            created_at: timestamp,
        }
    };
    handleDatabaseOperation(req, res, 'UPDATE', payload);
});

app.delete('/:id', (req, res) => {
    const { id } = req.params;
    const payload = { id: id };
    handleDatabaseOperation(req, res, 'DELETE', payload);
});

export default (req, res) => {
    app(req, res);
};