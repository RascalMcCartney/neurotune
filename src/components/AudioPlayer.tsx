import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  audioFile?: string;
  artwork?: string;
  duration?: string;
}

interface AudioPlayerProps {
  track: Track | null;
  isVisible: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  isVisible,
  onClose,
  onNext,
  onPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const skipBackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipForwardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipBackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const skipForwardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate mock waveform data
  useEffect(() => {
    if (track) {
      const mockWaveform = Array.from({ length: 200 }, () => Math.random() * 100);
      setWaveformData(mockWaveform);
    }
  }, [track]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onNext) {
        onNext();
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onNext]);

  // Load new track
  useEffect(() => {
    if (track?.audioFile && audioRef.current) {
      audioRef.current.src = track.audioFile;
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [track?.audioFile]);

  // Play/pause control
  const togglePlayPause = async () => {
    if (!audioRef.current || !track?.audioFile) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  // Skip backward functionality
  const handleSkipBackStart = () => {
    skipBack(5);
    skipBackTimeoutRef.current = setTimeout(() => {
      skipBackIntervalRef.current = setInterval(() => skipBack(5), 200);
    }, 500);
  };

  const handleSkipBackEnd = () => {
    if (skipBackTimeoutRef.current) {
      clearTimeout(skipBackTimeoutRef.current);
      skipBackTimeoutRef.current = null;
    }
    if (skipBackIntervalRef.current) {
      clearInterval(skipBackIntervalRef.current);
      skipBackIntervalRef.current = null;
    }
  };

  const handleSkipBackDoubleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Skip forward functionality
  const handleSkipForwardStart = () => {
    skipForward(5);
    skipForwardTimeoutRef.current = setTimeout(() => {
      skipForwardIntervalRef.current = setInterval(() => skipForward(5), 200);
    }, 500);
  };

  const handleSkipForwardEnd = () => {
    if (skipForwardTimeoutRef.current) {
      clearTimeout(skipForwardTimeoutRef.current);
      skipForwardTimeoutRef.current = null;
    }
    if (skipForwardIntervalRef.current) {
      clearInterval(skipForwardIntervalRef.current);
      skipForwardIntervalRef.current = null;
    }
  };

  const handleSkipForwardDoubleClick = () => {
    if (onNext) {
      onNext();
    }
  };

  const skipBack = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds);
    }
  };

  const skipForward = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + seconds);
    }
  };

  // Progress bar seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
  };

  // Volume control
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Close and stop
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onClose();
  };

  if (!isVisible || !track) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Playback control bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-2xl">
        {/* 3D Bevel effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative px-6 py-4">
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className="absolute top-0 left-0 right-0 h-1 bg-gray-700 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ left: `${progressPercentage}%` }}
            />
          </div>

          {/* Waveform visualization */}
          <div className="absolute top-1 left-0 right-0 h-1 flex items-end justify-center opacity-30">
            {waveformData.slice(0, 100).map((height, index) => (
              <div
                key={index}
                className="bg-blue-400 mx-px"
                style={{
                  height: `${Math.max(1, height / 100 * 4)}px`,
                  width: '2px',
                  opacity: index < (progressPercentage / 100) * 100 ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            {/* Left side - Track info and artwork */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Artwork */}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg shadow-lg flex-shrink-0 overflow-hidden">
                {track.artwork ? (
                  <img 
                    src={track.artwork} 
                    alt={track.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                  </div>
                )}
              </div>

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">{track.name}</h3>
                <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                {track.album && (
                  <p className="text-gray-500 text-xs truncate">{track.album}</p>
                )}
              </div>
            </div>

            {/* Center - Playback controls */}
            <div className="flex items-center space-x-4">
              {/* Skip backward */}
              <button
                onMouseDown={handleSkipBackStart}
                onMouseUp={handleSkipBackEnd}
                onMouseLeave={handleSkipBackEnd}
                onDoubleClick={handleSkipBackDoubleClick}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 active:scale-95"
                title="Skip back 5s (hold to scrub, double-click for start)"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>

              {/* Skip forward */}
              <button
                onMouseDown={handleSkipForwardStart}
                onMouseUp={handleSkipForwardEnd}
                onMouseLeave={handleSkipForwardEnd}
                onDoubleClick={handleSkipForwardDoubleClick}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 active:scale-95"
                title="Skip forward 5s (hold to scrub, double-click for next)"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Right side - Volume and close */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              {/* Time display */}
              <div className="text-sm text-gray-400 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="p-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                title="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default AudioPlayer;