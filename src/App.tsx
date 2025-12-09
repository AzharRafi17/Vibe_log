"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, TrendingUp, Heart } from "lucide-react"

import Header from "./Header"; 
import Footer from "./Footer"; 

import AddAffirmationModal from "./AddAffirmationModal"
import EditAffirmationModal from "./EditAffirmationModal"
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"
import VibeList from "./VibeList"
import MoodChart from "./MoodChart"

import { 
  moodConfig, 
  getLatestMoodConfig, 
  calculateMoodStats, 
} from "./utils" 
import type { 
  Affirmation,
  MoodKey
} from "./utils" 

const API_BASE = '/api/vibes';

const lightMoodConfig = {
    joyful: 'from-amber-100 to-yellow-200',
    grateful: 'from-rose-100 to-pink-200',
    calm: 'from-sky-100 to-blue-200',
    energized: 'from-lime-100 to-green-200',
    hopeful: 'from-violet-100 to-purple-200',
    default: 'from-white to-gray-50', 
    angry: 'from-red-200 to-rose-300',
}

export default function App() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingAffirmation, setEditingAffirmation] = useState<Affirmation | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)


  const fetchAffirmations = useCallback(async () => {
    try {
      setLoading(true)
      
      const response = await fetch(API_BASE); 
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data via proxy.');
      }
      
      const data = await response.json();
      
      const formattedData: Affirmation[] = data.map((item: any) => {
        const safeRating = item.mood_rating ?? 3;
        
        return {
            id: item.id,
            text: item.affirmation_text,
            mood: (item.mood_type as MoodKey) ?? 'calm', 
            rating: safeRating, 
            createdAt: new Date(item.created_at),
        };
      })
      
      setAffirmations(formattedData)
    } catch (error) {
      console.error('Failed to fetch affirmations:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAffirmations()
  }, [fetchAffirmations])

  const handleAddAffirmation = async (text: string, mood: MoodKey, timestamp: Date, rating: number) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mood,
          rating,
          timestamp: timestamp.toISOString(), 
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Error adding vibe via proxy.';
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
             const errorData = await response.json();
             errorMessage = errorData.error || errorMessage;
        } else {
             errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }
      
      setIsAddModalOpen(false)
      await fetchAffirmations() 
    } catch (error) {
      console.error('Failed to add affirmation:', error)
    }
  }

  const handleUpdateAffirmation = async (id: string, text: string, mood: MoodKey, timestamp: Date, rating: number) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          mood,
          rating,
          timestamp: timestamp.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating vibe via proxy.');
      }
      
      setEditingAffirmation(null)
      await fetchAffirmations() 
    } catch (error) {
      console.error('Failed to update affirmation:', error)
    }
  }

  const handleDeleteAffirmation = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting vibe via proxy.');
      }
      
      setDeleteId(null)
      await fetchAffirmations() 
    } catch (error) {
      console.error('Failed to delete affirmation:', error)
    }
  }

  const latestMoodConfig = getLatestMoodConfig(affirmations, moodConfig)
  const moodStats = calculateMoodStats(affirmations)
  const latestMood = affirmations[0]?.mood || "calm"
  const latestRating = affirmations[0]?.rating ?? 3 

  const hasVibes = affirmations.length > 0;
  
  const mainGradientClass = hasVibes 
      ? lightMoodConfig[latestMood as keyof typeof lightMoodConfig] 
      : lightMoodConfig.default;

  const headerTextColor = hasVibes ? 'text-gray-900' : 'text-gray-900';
  const backdropClass = hasVibes ? 'backdrop-blur-[20px] bg-white/50' : 'bg-white';
  const cardBgClass = hasVibes ? 'bg-white/80 border border-gray-200' : 'bg-white border border-gray-200';
  const cardTextColor = 'text-gray-800';
  const cardTitleColor = 'text-gray-600';

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-900 transition-all duration-1000">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce text-white">✨</div>
            <p className="text-white text-xl font-semibold">Loading your vibes...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${mainGradientClass} transition-all duration-1000`}>
      
      <Header 
          onAddVibe={() => setIsAddModalOpen(true)}
          headerTextColor={headerTextColor}
      />

      <main className={`pb-16 pt-8`}> 
        <div className={`${backdropClass} min-h-[calc(100vh-8rem)]`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {hasVibes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className={`rounded-3xl p-4 sm:p-6 shadow-xl ${cardBgClass}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${cardTitleColor}`}>Total Entries</p>
                      <p className={`text-3xl sm:text-4xl font-black ${cardTextColor}`}>{affirmations.length}</p>
                    </div>
                    <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-red-500 text-red-500" />
                  </div>
                </div>

                <div className={`rounded-3xl p-4 sm:p-6 shadow-xl ${cardBgClass}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold mb-1 text-sm sm:text-base ${cardTitleColor}`}>Current Mood</p>
                      <p className={`text-xl sm:text-2xl font-bold ${cardTextColor} flex items-center gap-2`}>
                        <span className="text-2xl sm:text-3xl">{latestMoodConfig.icon}</span>
                        <span className="truncate">{latestMoodConfig.label}</span>
                      </p>
                      <p className={`text-xs sm:text-sm mt-2 ${cardTitleColor}`}>
                         Rating: {latestRating}/5
                      </p>
                    </div>
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 flex-shrink-0" />
                  </div>
                </div>
                
                <div className={`rounded-3xl p-4 sm:p-6 shadow-xl col-span-1 sm:col-span-2 ${cardBgClass}`}>
                  <p className={`font-semibold mb-3 text-sm sm:text-base ${cardTitleColor}`}>Mood Distribution</p>
                  <MoodChart moodStats={moodStats} moodConfig={moodConfig} />
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-12 sm:py-20 text-center rounded-3xl bg-gradient-to-br ${lightMoodConfig.default} shadow-lg mx-2 sm:mx-0`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-md">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 sm:mb-4 px-4">No vibes yet!</h2>
                <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 max-w-md px-4">
                  Start your journey by adding your first affirmation and set the mood for your day.
                </p>
              </div>
            )}

            {hasVibes && (
                <VibeList 
                    affirmations={affirmations}
                    onEdit={(aff) => setEditingAffirmation(aff)}
                    onDelete={(id) => setDeleteId(id)}
                />
            )}
            
          </div>
        </div>
      </main>

      <Footer />
      
      <AddAffirmationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddAffirmation}
      />

      {editingAffirmation && (
        <EditAffirmationModal
          affirmation={editingAffirmation}
          onClose={() => setEditingAffirmation(null)}
          onUpdate={handleUpdateAffirmation}
        />
      )}

      {deleteId && (
        <DeleteConfirmationDialog
          onDelete={() => handleDeleteAffirmation(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}