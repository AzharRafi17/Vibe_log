"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MoodKey } from './utils';

import { moodConfig } from './utils'; 

interface MoodChartProps {
    moodStats: Record<MoodKey, number>;
    moodConfig: typeof moodConfig;
}

const chartColorMap: Record<MoodKey, string> = {
    joyful: '#fbbf24', 
    grateful: '#f472b6', 
    calm: '#38bdf8', 
    energized: '#4ade80',
    hopeful: '#a78bfa' 
};

export default function MoodChart({ moodStats, moodConfig }: MoodChartProps) {
    
    const chartData = (Object.keys(moodConfig) as MoodKey[])
        .map((moodKey) => {
            const count = moodStats[moodKey] || 0;
            
            return {
                name: moodConfig[moodKey].label,
                count: count,
                fill: chartColorMap[moodKey], 
            };
        })
        .filter(d => d.count > 0); 

    if (chartData.length === 0) {
        return <p className="text-gray-500 text-center py-4">Add your first vibe to see the mood distribution!</p>;
    }

    return (
        <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: -10, bottom: 5 }} 
                    layout="horizontal"
                    barCategoryGap="15%" 
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        interval={0}
                        padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                        dataKey="count" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        allowDecimals={false}
                        minTickGap={1}
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                        contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #ddd', 
                            fontSize: '12px' 
                        }}
                        formatter={(value: number, _: string, props) => [value, props.payload.name]}
                    />
                    <Bar 
                        dataKey="count" 
                        radius={[6, 6, 0, 0]} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}