import React, { useState } from 'react';
import { Piano, X } from 'lucide-react';

interface MusicalKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySelect: (key: string) => void;
  selectedKey: string | null;
}

const MusicalKeyboard: React.FC<MusicalKeyboardProps> = ({
  isOpen,
  onClose,
  onKeySelect,
  selectedKey
}) => {
  if (!isOpen) return null;

  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeys = [
    { key: 'C#', position: 8.5 },
    { key: 'D#', position: 21.5 },
    { key: 'F#', position: 47.5 },
    { key: 'G#', position: 60.5 },
    { key: 'A#', position: 73.5 }
  ];

  const handleKeyClick = (key: string) => {
    onKeySelect(key === selectedKey ? '' : key);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Piano className="w-6 h-6 text-purple-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Filter by Musical Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Selected Key Display */}
        <div className="mb-6 text-center">
          <p className="text-gray-400 mb-2">Selected Key:</p>
          <div className="text-2xl font-bold text-white">
            {selectedKey || 'None'}
            {selectedKey && (
              <span className="ml-2 text-sm text-gray-400">
                ({selectedKey.includes('#') ? 'Sharp' : 'Natural'})
              </span>
            )}
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="relative mx-auto" style={{ width: '400px', height: '120px' }}>
          {/* White Keys */}
          {whiteKeys.map((key, index) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`absolute border-2 rounded-b-lg transition-all duration-200 ${
                selectedKey === key
                  ? 'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
              style={{
                left: `${index * 13}%`,
                width: '13%',
                height: '100%'
              }}
            >
              <span className={`text-sm font-semibold ${
                selectedKey === key ? 'text-white' : 'text-gray-800'
              }`}>
                {key}
              </span>
            </button>
          ))}

          {/* Black Keys */}
          {blackKeys.map(({ key, position }) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`absolute rounded-b-lg transition-all duration-200 ${
                selectedKey === key
                  ? 'bg-purple-600 shadow-lg shadow-purple-500/50'
                  : 'bg-gray-900 hover:bg-gray-700'
              }`}
              style={{
                left: `${position}%`,
                width: '8%',
                height: '65%',
                zIndex: 2
              }}
            >
              <span className="text-xs font-semibold text-white">
                {key}
              </span>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-300 text-center">
            Click on a piano key to filter tracks by musical key. Click the same key again to remove the filter.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleKeyClick('')}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Clear Filter
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicalKeyboard;