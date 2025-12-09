import { Heart, Code } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-16 py-8 border-t border-gray-200 bg-gray-50/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
                <p className="flex items-center justify-center gap-1 mb-2">
                    Made with <Heart className="w-4 h-4 text-red-500" /> for a positive mindset.
                </p>
                <p className="flex items-center justify-center gap-1">
                    <Code className="w-4 h-4 text-blue-500" /> 
                    Powered DEV ENGIMA TEAM.
                </p>
                <p className="mt-4">&copy; {new Date().getFullYear()} Daily Vibes Tracker. All rights reserved.</p>
            </div>
        </footer>
    );
}