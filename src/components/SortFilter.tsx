import React, { useState, useEffect } from 'react';
import { ArrowUpDown, X, Check, Plus, Minus, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
  priority: number;
}

interface SortFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onSortChange: (sortCriteria: SortCriteria[]) => void;
  currentSortCriteria: SortCriteria[];
}

const SortFilter: React.FC<SortFilterProps> = ({
  isOpen,
  onClose,
  onSortChange,
  currentSortCriteria
}) => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>(currentSortCriteria || []);

  useEffect(() => {
    if (isOpen) {
      setSortCriteria(currentSortCriteria && currentSortCriteria.length > 0 ? [...currentSortCriteria] : []);
    }
  }, [isOpen, currentSortCriteria]);

  if (!isOpen) return null;

  const sortOptions = [
    { value: 'title', label: 'Title', description: 'Sort alphabetically by track title' },
    { value: 'artist', label: 'Artist', description: 'Sort alphabetically by artist name' },
    { value: 'album', label: 'Album', description: 'Sort alphabetically by album name' },
    { value: 'genre', label: 'Genre', description: 'Sort alphabetically by music genre' },
    { value: 'year', label: 'Year', description: 'Sort by release year' },
    { value: 'duration', label: 'Duration', description: 'Sort by track length' },
    { value: 'bpm', label: 'BPM', description: 'Sort by beats per minute' },
    { value: 'key', label: 'Musical Key', description: 'Sort by musical key' },
    { value: 'energy', label: 'Energy Level', description: 'Sort by track energy/intensity' },
    { value: 'popularity', label: 'Popularity', description: 'Sort by popularity score' }
  ];

  const availableOptions = sortOptions.filter(
    option => !sortCriteria.some(criteria => criteria.field === option.value)
  );

  const addSortCriteria = (field: string) => {
    const newCriteria: SortCriteria = {
      field,
      direction: 'asc',
      priority: sortCriteria.length + 1
    };
    setSortCriteria([...sortCriteria, newCriteria]);
  };

  const removeSortCriteria = (index: number) => {
    const newCriteria = sortCriteria.filter((_, i) => i !== index);
    // Renumber priorities
    const renumbered = newCriteria.map((criteria, i) => ({
      ...criteria,
      priority: i + 1
    }));
    setSortCriteria(renumbered);
  };

  const toggleDirection = (index: number) => {
    const newCriteria = [...sortCriteria];
    newCriteria[index].direction = newCriteria[index].direction === 'asc' ? 'desc' : 'asc';
    setSortCriteria(newCriteria);
  };

  const moveCriteria = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sortCriteria.length - 1)
    ) {
      return;
    }

    const newCriteria = [...sortCriteria];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [newCriteria[index], newCriteria[targetIndex]] = [newCriteria[targetIndex], newCriteria[index]];
    
    // Update priorities
    const renumbered = newCriteria.map((criteria, i) => ({
      ...criteria,
      priority: i + 1
    }));
    
    setSortCriteria(renumbered);
  };

  const handleApply = () => {
    onSortChange(sortCriteria);
    onClose();
  };

  const handleReset = () => {
    setSortCriteria([{ field: 'title', direction: 'asc', priority: 1 }]);
  };

  const getOptionLabel = (field: string) => {
    const option = sortOptions.find(opt => opt.value === field);
    return option ? option.label : field;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ArrowUpDown className="w-6 h-6 text-blue-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Multi-Field Sorting</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Current Sort Display */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-3 text-sm">Current Sort Order:</p>
          {sortCriteria.length === 0 ? (
            <p className="text-gray-500 italic">No sorting applied</p>
          ) : (
            <div className="space-y-2">
              {sortCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-center space-y-1">
                      <button
                        onClick={() => moveCriteria(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      </button>
                      <GripVertical className="w-4 h-4 text-gray-500" />
                      <button
                        onClick={() => moveCriteria(index, 'down')}
                        disabled={index === sortCriteria.length - 1}
                        className="p-1 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <span className="text-white font-medium">
                          {getOptionLabel(criteria.field)}
                        </span>
                        <button
                          onClick={() => toggleDirection(index)}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs text-white transition-colors duration-200"
                        >
                          <ArrowUpDown className={`w-3 h-3 ${criteria.direction === 'desc' ? 'rotate-180' : ''}`} />
                          <span>{criteria.direction === 'asc' ? 'A→Z' : 'Z→A'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {criteria.direction === 'asc' ? 'Ascending' : 'Descending'} order
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSortCriteria(index)}
                    className="p-2 text-red-400 hover:bg-red-900 hover:text-red-300 rounded transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Sort Field */}
        {availableOptions.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-300 mb-3 text-sm font-medium">Add Sort Field:</p>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {availableOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => addSortCriteria(option.value)}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-gray-700 hover:border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                    <Plus className="w-4 h-4 text-blue-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <h4 className="text-blue-300 font-medium mb-2">How it works:</h4>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Fields are sorted by priority (1 = highest priority)</li>
            <li>• Use arrows to reorder fields by priority</li>
            <li>• Click direction button to toggle ascending/descending</li>
            <li>• Add up to {sortOptions.length} different sort fields</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            Reset to Title
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Apply Sort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;