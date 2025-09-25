import React from 'react';
import { 
  Edit3, 
  Trash2, 
  FolderPlus, 
  Copy, 
  Move,
  Palette,
  Eye,
  EyeOff 
} from 'lucide-react';
import { FolderContextMenuProps } from '../types/folder';

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  position,
  onClose,
  onAction
}) => {
  const handleAction = (action: string) => {
    onAction(action, folder);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl py-2 z-50 min-w-[180px]"
        style={{
          left: Math.min(position.x, window.innerWidth - 200),
          top: Math.min(position.y, window.innerHeight - 250)
        }}
      >
        <div className="px-4 py-2 border-b border-gray-600 mb-2">
          <p className="text-sm font-medium text-white truncate">
            {folder.name}
          </p>
        </div>

        <button
          onClick={() => handleAction('rename')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Edit3 className="w-4 h-4 mr-3 text-blue-400" />
          Rename
        </button>

        <button
          onClick={() => handleAction('addSubfolder')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <FolderPlus className="w-4 h-4 mr-3 text-green-400" />
          Add Subfolder
        </button>

        <button
          onClick={() => handleAction('changeColor')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Palette className="w-4 h-4 mr-3 text-purple-400" />
          Change Color
        </button>

        <hr className="border-gray-600 my-2" />

        <button
          onClick={() => handleAction('copy')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          <Copy className="w-4 h-4 mr-3 text-orange-400" />
          Duplicate Folder
        </button>

        <button
          onClick={() => handleAction(folder.expanded ? 'collapse' : 'expand')}
          className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors duration-200"
        >
          {folder.expanded ? (
            <EyeOff className="w-4 h-4 mr-3 text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 mr-3 text-gray-400" />
          )}
          {folder.expanded ? 'Collapse' : 'Expand'} All
        </button>

        <hr className="border-gray-600 my-2" />

        <button
          onClick={() => handleAction('delete')}
          className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Delete Folder
        </button>
      </div>
    </>
  );
};

export default FolderContextMenu;