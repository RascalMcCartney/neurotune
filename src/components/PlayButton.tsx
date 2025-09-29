import React from 'react';
import { Play } from 'lucide-react';

interface PlayButtonProps {
  onClick: () => void;
  className?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 
        hover:from-blue-600 hover:to-purple-700 rounded-full shadow-lg 
        hover:shadow-xl transition-all duration-300 active:scale-95
        flex items-center justify-center
        ${className}
      `}
      title="Play track"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
      
      {/* Play icon */}
      <Play className="w-5 h-5 text-white ml-0.5 relative z-10" />
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-ping opacity-20" />
    </button>
  );
};

export default PlayButton;