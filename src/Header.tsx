import { Sparkles } from "lucide-react";

interface HeaderProps {
    onAddVibe: () => void;
    headerTextColor: string;
}

export default function Header({ onAddVibe, headerTextColor }: HeaderProps) {
    return (
        <header className="py-6 border-b border-gray-200/50 backdrop-blur-sm sticky top-0 z-10 bg-white/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                <div className="flex items-center">
                    <h1 className={`text-4xl font-black drop-shadow-sm flex items-center gap-3 ${headerTextColor}`}>
                        <Sparkles className="w-8 h-8 text-amber-500" />
                        Daily Vibes
                    </h1>
                </div>

                <button
                    onClick={onAddVibe}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:shadow-amber-500/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-sm md:text-base"
                >
                    <Sparkles className="w-5 h-5" />
                    Add New Vibe
                </button>
            </div>
        </header>
    );
}