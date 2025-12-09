"use client"

import { useState, useEffect } from "react"
import { Clock, Star } from "lucide-react"
import { moodConfig } from "./utils"
import type { 
  Affirmation, 
  MoodKey     
} from "./utils"

interface EditAffirmationModalProps {
    affirmation: Affirmation;
    onClose: () => void;
    onUpdate: (id: string, text: string, mood: MoodKey, timestamp: Date, rating: number) => void; 
}

export default function EditAffirmationModal({ affirmation, onClose, onUpdate }: EditAffirmationModalProps) {
  const [text, setText] = useState(affirmation.text)
  const [mood, setMood] = useState(affirmation.mood)
  const [rating, setRating] = useState(affirmation.rating || 3) 
  const [selectedTime, setSelectedTime] = useState("")

  useEffect(() => {
    const date = new Date(affirmation.createdAt)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    setSelectedTime(`${hours}:${minutes}`)
  }, [affirmation])

  const handleSubmit = () => {
    if (!text.trim()) return
    
    const [hours, minutes] = selectedTime.split(':')
    const timestamp = new Date(affirmation.createdAt)
    timestamp.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    onUpdate(affirmation.id, text, mood, timestamp, rating) 
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-8 max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Edit Your Vibe
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
              Your Affirmation
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
              rows={4}
              placeholder="Write your affirmation..."
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              Rate Your Mood
            </label>
            <div className="flex items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125 active:scale-110"
                >
                  <Star
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 hover:text-amber-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300 ml-2 sm:ml-3">
                {rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
              Choose Your Mood
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {Object.entries(moodConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setMood(key as MoodKey)}
                  className={`flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${
                    mood === key 
                      ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg scale-105` 
                      : 'bg-gray-100 dark:bg-gray-800 hover:scale-105'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{config.icon}</span>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-center">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-base bg-gradient-to-r ${moodConfig[mood].gradient} shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Update Affirmation
          </button>
        </div>
      </div>
    </div>
  )
}