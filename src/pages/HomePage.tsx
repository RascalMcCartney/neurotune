import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Music, ArrowUpDown, Heart, Share2, MoreVertical, Clock, User, Disc, Calendar, Hash, Activity, Key, Zap, Target, Plus, Grid3x3 as Grid3X3, List, Eye, Play, Pause } from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';
import AddTrackDropdown from '../components/AddTrackDropdown';
import FolderManage from '../components/FolderManage';
import BPMFilter from '../components/BPMFilter';
import GenreFilter from '../components/GenreFilter';
import MusicalKeyboard from '../components/MusicalKeyboard';
import AudioFeaturesFilter from '../components/AudioFeaturesFilter';
import SortFilter from '../components/SortFilter';
import StorageStatus from '../components/StorageStatus';
import { useAudio } from '../contexts/AudioContext';
import type { Track, Folder, AudioFeaturesFilters } from '../types/folder';

interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
  priority: number;
}

const HomePage: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = useAudio();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [bpmRange, setBpmRange] = useState<{min: number | null, max: number | null}>({ min: null, max: null });
  const [audioFeatures, setAudioFeatures] = useState<AudioFeaturesFilters>({
    energy: null,
    danceability: null,
    valence: null
  });
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([
    { field: 'title', direction: 'asc', priority: 1 }
  ]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter modal states
  const [showBPMFilter, setShowBPMFilter] = useState(false);
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [showKeyFilter, setShowKeyFilter] = useState(false);
  const [showAudioFeaturesFilter, setShowAudioFeaturesFilter] = useState(false);
  const [showSortFilter, setShowSortFilter] = useState(false);

  // Folder management state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);

  // Mock data - replace with real data from your backend
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      name: 'Midnight Dreams',
      artist: 'Luna Eclipse',
      album: 'Stellar Nights',
      genre: 'Electronic',
      year: '2024',
      duration: '3:45',
      bpm: '128',
      key: 'Am',
      energy: 85,
      danceability: 92,
      valence: 70,
      audioFile: '/temp/audio/1758961239205_29f7ac1b-3eb5-499c-a137-f37bfd90144f.mp3',
      artwork: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=300',
      folder_id: '1'
    },
    {
      id: '2',
      name: 'Ocean Waves',
      artist: 'Coastal Vibes',
      album: 'Tidal Flow',
      genre: 'Ambient',
      year: '2023',
      duration: '4:12',
      bpm: '85',
      key: 'C',
      energy: 45,
      danceability: 30,
      valence: 80,
      audioFile: '/temp/audio/sample2.mp3',
      artwork: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      name: 'Thunder Strike',
      artist: 'Electric Storm',
      album: 'Power Surge',
      genre: 'Rock',
      year: '2024',
      duration: '3:28',
      bpm: '140',
      key: 'E',
      energy: 95,
      danceability: 60,
      valence: 85,
      audioFile: '/temp/audio/sample3.mp3',
      artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      folder_id: '2'
    },
    {
      id: '4',
      name: 'City Lights',
      artist: 'Urban Flow',
      album: 'Metropolitan',
      genre: 'Hip Hop',
      year: '2024',
      duration: '2:58',
      bpm: '95',
      key: 'F#',
      energy: 70,
      danceability: 85,
      valence: 75,
      audioFile: '/temp/audio/sample4.mp3',
      artwork: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '5',
      name: 'Forest Whispers',
      artist: 'Nature Sounds',
      album: 'Earth Elements',
      genre: 'Ambient',
      year: '2023',
      duration: '5:33',
      bpm: '70',
      key: 'G',
      energy: 25,
      danceability: 15,
      valence: 60,
      audioFile: '/temp/audio/sample5.mp3',
      artwork: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=300',
      folder_id: '3'
    }
  ]);

  // Filter and sort tracks
  const filteredTracks = useMemo(() => {
    let filtered = tracks.filter(track => {
      // Search filter
      if (searchTerm && !track.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !track.artist.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !track.album?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Genre filter
      if (selectedGenre !== 'All Genres' && track.genre !== selectedGenre) {
        return false;
      }

      // Key filter
      if (selectedKey && track.key !== selectedKey) {
        return false;
      }

      // BPM filter
      if (bpmRange.min !== null && parseInt(track.bpm || '0') < bpmRange.min) {
        return false;
      }
      if (bpmRange.max !== null && parseInt(track.bpm || '0') > bpmRange.max) {
        return false;
      }

      // Audio features filters
      if (audioFeatures.energy && track.energy !== undefined) {
        if (track.energy < audioFeatures.energy.min || track.energy > audioFeatures.energy.max) {
          return false;
        }
      }
      if (audioFeatures.danceability && track.danceability !== undefined) {
        if (track.danceability < audioFeatures.danceability.min || track.danceability > audioFeatures.danceability.max) {
          return false;
        }
      }
      if (audioFeatures.valence && track.valence !== undefined) {
        if (track.valence < audioFeatures.valence.min || track.valence > audioFeatures.valence.max) {
          return false;
        }
      }

      // Folder filter
      if (selectedFolderId === null) {
        return !track.folder_id; // Show only tracks without folder
      } else {
        return track.folder_id === selectedFolderId;
      }
    });

    // Sort tracks
    filtered.sort((a, b) => {
      for (const criterion of sortCriteria) {
        const aVal = a[criterion.field as keyof Track] || '';
        const bVal = b[criterion.field as keyof Track] || '';
        
        let comparison = 0;
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        }
        
        if (comparison !== 0) {
          return criterion.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });

    return filtered;
  }, [tracks, searchTerm, selectedGenre, selectedKey, bpmRange, audioFeatures, sortCriteria, selectedFolderId]);

  // Get active filter count
  const activeFilterCount = [
    searchTerm,
    selectedGenre !== 'All Genres' ? selectedGenre : null,
    selectedKey,
    bpmRange.min !== null || bpmRange.max !== null ? 'bpm' : null,
    audioFeatures.energy || audioFeatures.danceability || audioFeatures.valence ? 'features' : null
  ].filter(Boolean).length;

  const handleTracksAdded = (newTracks: any[]) => {
    // Convert and add new tracks to the tracks array
    const convertedTracks: Track[] = newTracks.map((track, index) => ({
      id: `new_${Date.now()}_${index}`,
      name: track.name,
      artist: track.artist,
      album: track.album || '',
      genre: track.genre || 'Unknown',
      year: track.year || new Date().getFullYear().toString(),
      duration: track.duration || '0:00',
      bpm: track.bpm || '',
      key: track.key || '',
      energy: Math.floor(Math.random() * 100),
      danceability: Math.floor(Math.random() * 100),
      valence: Math.floor(Math.random() * 100),
      audioFile: track.azureFileUrl || track.fileUrl,
      artwork: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=300`,
      folder_id: selectedFolderId
    }));

    setTracks(prevTracks => [...prevTracks, ...convertedTracks]);
  };

  const renderTrackCard = (track: Track) => (
    <div
      key={track.id}
      className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden group hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
      onMouseEnter={() => setHoveredTrackId(track.id)}
      onMouseLeave={() => setHoveredTrackId(null)}
    >
      {/* Album Artwork */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800">
        {track.artwork ? (
          <img 
            src={track.artwork} 
            alt={track.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
          hoveredTrackId === track.id ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={() => playTrack({
              id: track.id,
              name: track.name,
              artist: track.artist,
              album: track.album,
              audioFile: track.audioFile,
              artwork: track.artwork,
              duration: track.duration
            })}
            className="w-16 h-16 bg-gradient-to-br from-gold-400 to-burnt-orange-500 hover:from-gold-500 hover:to-burnt-orange-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-xl"
          >
            {currentTrack?.id === track.id && isPlaying ? (
              <Pause className="w-7 h-7 text-white" />
            ) : (
              <Play className="w-7 h-7 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Track Info Overlay (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="text-white">
              {track.energy && (
                <div className="flex items-center space-x-1 text-xs">
                  <Zap className="w-3 h-3 text-gold-400" />
                  <span>{track.energy}%</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200">
                <Heart className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Track Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-gold-300 transition-colors duration-200">
            {track.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
          {track.album && (
            <p className="text-gray-500 text-xs truncate">{track.album}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{track.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>{track.bpm} BPM</span>
          </div>
          <div className="flex items-center space-x-1">
            <Key className="w-3 h-3" />
            <span>{track.key || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Hash className="w-3 h-3" />
            <span>{track.genre}</span>
          </div>
        </div>

        {/* Audio Features Bar */}
        {(track.energy !== undefined || track.danceability !== undefined || track.valence !== undefined) && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500 font-medium">Audio Features</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {track.energy !== undefined && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gold-400">Energy</span>
                    <span className="text-white">{track.energy}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gold-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${track.energy}%` }}
                    />
                  </div>
                </div>
              )}
              {track.danceability !== undefined && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-ocean-blue-400">Dance</span>
                    <span className="text-white">{track.danceability}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-ocean-blue-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${track.danceability}%` }}
                    />
                  </div>
                </div>
              )}
              {track.valence !== undefined && (
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-burnt-orange-400">Happy</span>
                    <span className="text-white">{track.valence}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-burnt-orange-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${track.valence}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderListView = (track: Track) => (
    <div
      key={track.id}
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 hover:bg-gray-750 transition-all duration-200 group"
      onMouseEnter={() => setHoveredTrackId(track.id)}
      onMouseLeave={() => setHoveredTrackId(null)}
    >
      <div className="flex items-center space-x-4">
        {/* Artwork */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 flex-shrink-0">
          {track.artwork ? (
            <img src={track.artwork} alt={track.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            hoveredTrackId === track.id ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => playTrack({
                id: track.id,
                name: track.name,
                artist: track.artist,
                album: track.album,
                audioFile: track.audioFile,
                artwork: track.artwork,
                duration: track.duration
              })}
              className="w-8 h-8 bg-gradient-to-br from-gold-400 to-burnt-orange-500 hover:from-gold-500 hover:to-burnt-orange-600 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="w-3 h-3 text-white" />
              ) : (
                <Play className="w-3 h-3 text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate group-hover:text-gold-300 transition-colors duration-200">
            {track.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{track.artist}</p>
          {track.album && <p className="text-gray-500 text-xs truncate">{track.album}</p>}
        </div>

        {/* Track Details */}
        <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-400">
          <span>{track.duration}</span>
          <span>{track.bpm} BPM</span>
          <span>{track.key}</span>
          <span>{track.genre}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue-950 via-gray-900 to-deep-blue-900">
      <AuthHeader />
      
      <div className="flex">
        {/* Sidebar - Folder Management */}
        <div className="w-80 flex-shrink-0 h-screen sticky top-16 overflow-hidden">
          <div className="h-full p-6">
            <FolderManage 
              selectedFolderId={selectedFolderId}
              onFolderSelect={setSelectedFolderId}
              tracks={tracks}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 bg-gradient-to-br from-deep-blue-900/50 via-gray-900/80 to-deep-blue-900/50">
          <main className="p-6 pb-32"> {/* Extra bottom padding for audio player */}
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Music Library</h1>
                  <p className="text-gray-400">
                    {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''} 
                    {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active`}
                  </p>
                </div>
                <AddTrackDropdown onTracksAdded={handleTracksAdded} />
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search tracks, artists, albums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ocean-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowGenreFilter(true)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      selectedGenre !== 'All Genres'
                        ? 'bg-burnt-orange-600 text-white hover:bg-burnt-orange-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                    <span>{selectedGenre !== 'All Genres' ? selectedGenre : 'Genre'}</span>
                  </button>

                  <button
                    onClick={() => setShowBPMFilter(true)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      bpmRange.min !== null || bpmRange.max !== null
                        ? 'bg-ocean-blue-600 text-white hover:bg-ocean-blue-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>BPM</span>
                  </button>

                  <button
                    onClick={() => setShowKeyFilter(true)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      selectedKey
                        ? 'bg-deep-blue-600 text-white hover:bg-deep-blue-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>{selectedKey || 'Key'}</span>
                  </button>

                  <button
                    onClick={() => setShowAudioFeaturesFilter(true)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                      audioFeatures.energy || audioFeatures.danceability || audioFeatures.valence
                        ? 'bg-gold-600 text-white hover:bg-gold-700'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Features</span>
                  </button>

                  <button
                    onClick={() => setShowSortFilter(true)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort</span>
                  </button>
                </div>
              </div>

              {/* View Toggle and Storage Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'grid' ? 'bg-ocean-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'list' ? 'bg-ocean-blue-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <StorageStatus />
              </div>
            </div>

            {/* Track Grid/List */}
            {filteredTracks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {filteredTracks.map(renderTrackCard)}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTracks.map(renderListView)}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No tracks found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedGenre !== 'All Genres' || selectedKey || bpmRange.min || bpmRange.max || audioFeatures.energy || audioFeatures.danceability || audioFeatures.valence
                    ? 'Try adjusting your filters'
                    : 'Add some tracks to get started'
                  }
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Filter Modals */}
      <BPMFilter
        isOpen={showBPMFilter}
        onClose={() => setShowBPMFilter(false)}
        onBPMRangeChange={setBpmRange}
        currentMinBPM={bpmRange.min}
        currentMaxBPM={bpmRange.max}
      />

      <GenreFilter
        isOpen={showGenreFilter}
        onClose={() => setShowGenreFilter(false)}
        onGenreChange={setSelectedGenre}
        selectedGenre={selectedGenre}
      />

      <MusicalKeyboard
        isOpen={showKeyFilter}
        onClose={() => setShowKeyFilter(false)}
        onKeySelect={setSelectedKey}
        selectedKey={selectedKey}
      />

      <AudioFeaturesFilter
        isOpen={showAudioFeaturesFilter}
        onClose={() => setShowAudioFeaturesFilter(false)}
        onFiltersChange={setAudioFeatures}
        currentFilters={audioFeatures}
      />

      <SortFilter
        isOpen={showSortFilter}
        onClose={() => setShowSortFilter(false)}
        onSortChange={setSortCriteria}
        currentSortCriteria={sortCriteria}
      />

      <Footer style="margin-top: 3px;"/>
    </div>
  );
};

export default HomePage;