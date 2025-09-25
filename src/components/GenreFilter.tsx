import React, { useState, useEffect } from 'react';
import { Music, X, Search } from 'lucide-react';

interface GenreFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onGenreChange: (genre: string) => void;
  selectedGenre: string;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  isOpen,
  onClose,
  onGenreChange,
  selectedGenre
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const genres = [
    'All Genres',
    'Rock',
    'Pop',
    'Hip Hop',
    'Electronic',
    'Jazz',
    'Classical',
    'R&B',
    'Country',
    'Folk',
    'Reggae',
    'Blues',
    'Funk',
    'Soul',
    'Disco',
    'House',
    'Techno',
    'Dubstep',
    'Ambient',
    'Indie',
    'Alternative',
    'Punk',
    'Metal',
    'Progressive',
    'Experimental'
  ];

  const filteredGenres = genres.filter(genre =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenreSelect = (genre: string) => {
    onGenreChange(genre);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Music className="w-6 h-6 text-orange-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Select Genre</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Selection Display */}
        <div className="mb-6 text-center">
          <p className="text-gray-400 mb-2">Current Selection:</p>
          <div className="text-lg font-semibold text-white">
            {selectedGenre}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Genre List */}
        <div className="max-h-64 overflow-y-auto mb-6">
          <div className="space-y-1">
            {filteredGenres.map((genre, index) => (
              <button
                key={index}
                onClick={() => handleGenreSelect(genre)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedGenre === genre
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {filteredGenres.length === 0 && (
          <div className="text-center py-8">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No genres found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 text-center">
            Select a genre to filter tracks, or choose "All Genres" to show all tracks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => handleGenreSelect('All Genres')}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Show All
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreFilter;