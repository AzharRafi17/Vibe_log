import { Edit2, Trash2, Clock, Star } from "lucide-react"
import { moodConfig, formatTime, formatDate } from "./utils" 
import type { MoodKey, Affirmation } from "./utils"

interface VibeListProps {
  affirmations: Affirmation[]
  onEdit: (affirmation: Affirmation) => void
  onDelete: (id: string) => void
}

export default function VibeList({ affirmations, onEdit, onDelete }: VibeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {affirmations.map((aff) => {
        const rating = aff.rating ?? 3;
        const moodKey = aff.mood as MoodKey;
        const config = moodConfig[moodKey];
        
        return (
          <div
            key={aff.id}
            className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-lg ${config.shadow}`}>
                {config.icon}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(aff)}
                  className="p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => onDelete(aff.id)}
                  className="p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs font-semibold text-gray-600 ml-1">
                {config.label} ({rating}/5)
              </span>
            </div>

            <p className="text-gray-900 font-medium text-lg mb-4 leading-relaxed">
              {aff.text}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{formatTime(aff.createdAt)}</span>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {formatDate(aff.createdAt)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}