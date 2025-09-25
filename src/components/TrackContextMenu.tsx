import React from 'react';
import { Copy, Move, Trash2, Copy as Duplicate, FolderOpen, X } from 'lucide-react';
import { TrackContextMenuProps } from '../types/folder';

const TrackContextMenu: React.FC<TrackContextMenuProps> = ({
  tracks,
  position,
  onClose,
  onAction
}) => {
  const handleAction = (type: 'copy' | 'move' | 'delete' | 'duplicate') => {
    const trackIds = tracks.filter(t => t.selected).map(t => t.id);
    onAction({ type, trackIds });
    onClose();
  };

  const selectedCount = tracks.filter(t => t.selected).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl py-2 z-50 min-w-[200px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 220),
          top: Math.min(position.y, window.innerHeight - 200)
        }}
      >
        <div className="px-4 py-2 border-b border-gray-600 mb-2">
          <p className="text-sm font-medium text-white">
            {selectedCount} track{selectedCount !== 1 ? 's' : ''} selected
          </p>
        </div>

        <button
          onClick={() => handleAction('copy')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Copy className="w-4 h-4 mr-3 text-blue-400" />
          Copy to Folder
        </button>

        <button
          onClick={() => handleAction('move')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Move className="w-4 h-4 mr-3 text-green-400" />
          Move to Folder
        </button>

        <button
          onClick={() => handleAction('duplicate')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Duplicate className="w-4 h-4 mr-3 text-purple-400" />
          Duplicate
        </button>

        <hr className="border-gray-600 my-2" />

        <button
          onClick={() => handleAction('delete')}
          className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Delete
        </button>
      </div>
    </>
  );
};

export default TrackContextMenu;