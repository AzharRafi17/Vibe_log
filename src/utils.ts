export interface Affirmation {
  id: string;
  text: string;
  mood: "joyful" | "grateful" | "calm" | "energized" | "hopeful"|"angry";
  rating?: number; 
  createdAt: Date;

}

export type MoodKey = Affirmation["mood"];

interface MoodConfigEntry {
    gradient: string;
    icon: string;
    label: string;
    shadow: string;
}


export const moodConfig: Record<MoodKey, MoodConfigEntry> = {
  joyful: { 
    gradient: "from-amber-400 via-yellow-400 to-orange-500",
    icon: "😄",
    label: "Joyful",
    shadow: "shadow-amber-500/50"
  },
  grateful: { 
    gradient: "from-rose-400 via-pink-400 to-fuchsia-500",
    icon: "🙏",
    label: "Grateful",
    shadow: "shadow-pink-500/50"
  },
  calm: { 
    gradient: "from-sky-400 via-blue-400 to-indigo-500",
    icon: "🧘",
    label: "Calm",
    shadow: "shadow-blue-500/50"
  },
  energized: { 
    gradient: "from-lime-400 via-green-400 to-emerald-500",
    icon: "⚡",
    label: "Energized",
    shadow: "shadow-green-500/50"
  },
  hopeful: { 
    gradient: "from-violet-400 via-purple-400 to-indigo-500",
    icon: "✨",
    label: "Hopeful",
    shadow: "shadow-purple-500/50"
  },
  angry: {
        icon: '😡', 
        label: 'Angry',
        gradient: 'from-red-600 to-red-800', 
        shadow: 'shadow-red-600/50',
    },
}

export const mapRatingToMood = (rating: number): MoodKey => {
    const keys = Object.keys(moodConfig) as MoodKey[];
    return keys[rating - 1] || 'calm'; // Default to 'calm' if outside range
}

export const mapMoodToRating = (mood: MoodKey): number => {
    return Object.keys(moodConfig).indexOf(mood) + 1;
}


export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const getLatestMoodConfig = (affirmations: Affirmation[], config: typeof moodConfig): MoodConfigEntry => {
    const latestMood = affirmations[0]?.mood || "calm";
    return config[latestMood];
}

export const calculateMoodStats = (affirmations: Affirmation[]): Record<MoodKey, number> => {
    return affirmations.reduce((acc, aff) => {
        acc[aff.mood] = (acc[aff.mood] || 0) + 1;
        return acc;
    }, {} as Record<MoodKey, number>);
}