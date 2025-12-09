"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { moodConfig } from "./utils"
import type { 
  MoodKey     
} from "./utils"

interface AddAffirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (text: string, mood: MoodKey, timestamp: Date, rating: number) => void;
}

export default function AddAffirmationModal({ isOpen, onClose, onSave }: AddAffirmationModalProps) {
    const [text, setText] = useState("")
    const [mood, setMood] = useState<MoodKey>("calm") 
    const [rating, setRating] = useState(3) 
    const [selectedTime, setSelectedTime] = useState("")

    const currentMoodConfig = moodConfig[mood];

    useEffect(() => {
        if (isOpen) {
            const now = new Date()
            const hours = String(now.getHours()).padStart(2, '0')
            const minutes = String(now.getMinutes()).padStart(2, '0')
            setSelectedTime(`${hours}:${minutes}`)
            setText("")
            setMood("calm") 
            setRating(3) 
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSubmit = () => {
        if (!text.trim() || !selectedTime) return
        
        const [hours, minutes] = selectedTime.split(':')
        const timestamp = new Date()
        timestamp.setHours(parseInt(hours), parseInt(minutes), 0, 0)
        
       
        onSave(text, mood, timestamp, rating) 
        
        onClose() 
        setText("")
        setMood("calm") 
        setRating(3)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-8 max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Add Your Vibe
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl w-8 h-8 flex items-center justify-center">×</button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">Your Affirmation</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                            rows={4}
                            placeholder="I am capable of amazing things..."
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
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
                            Rate Your Mood Intensity 
                        </label>
                        <div className="flex items-center gap-2 sm:gap-3 justify-center">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => setRating(value)}
                                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-base sm:text-lg transition-all ${
                                        rating === value
                                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg scale-110'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:scale-105'
                                    }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">Choose Your Emotional Type</label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                            {Object.entries(moodConfig).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => setMood(key as MoodKey)}
                                    title={`This is the emotional category: ${config.label}`}
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
                        disabled={!text.trim() || !selectedTime}
                        className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white text-sm sm:text-base bg-gradient-to-r ${currentMoodConfig.gradient} shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Add Affirmation
                    </button>
                </div>
            </div>
        </div>
    )
}