import { useState, useCallback } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  album?: string;
  audioFile?: string;
  artwork?: string;
  duration?: string;
}

interface UseAudioPlayerReturn {
  currentTrack: Track | null;
  isPlayerVisible: boolean;
  playTrack: (track: Track) => void;
  closePlayer: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const useAudioPlayer = (tracks: Track[] = []): UseAudioPlayerReturn => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlayerVisible(true);
  }, []);

  const closePlayer = useCallback(() => {
    setIsPlayerVisible(false);
    setCurrentTrack(null);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
  }, [currentTrack, tracks]);

  const previousTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[previousIndex]);
  }, [currentTrack, tracks]);

  return {
    currentTrack,
    isPlayerVisible,
    playTrack,
    closePlayer,
    nextTrack,
    previousTrack
  };
};