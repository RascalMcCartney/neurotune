import React, { useEffect } from 'react';
import { 
  X, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Music, 
  Heart, 
  Download,
  Bell,
  Shield,
  Palette,
  UserCircle,
  Mail,
  Calendar
} from 'lucide-react';

interface SlideoutPaneProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onSignOut: () => void;
}

const SlideoutPane: React.FC<SlideoutPaneProps> = ({ 
  isOpen, 
  onClose, 
  currentUser,
  onSignOut 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Music, label: 'My Library', description: 'View your music collection' },
    { icon: Heart, label: 'Favorites', description: 'Songs you love' },
    { icon: Download, label: 'Downloads', description: 'Offline content' },
    { icon: Bell, label: 'Notifications', description: 'Stay updated' },
    { icon: Settings, label: 'Settings', description: 'App preferences' },
    { icon: Palette, label: 'Theme', description: 'Customize appearance' },
    { icon: Shield, label: 'Privacy', description: 'Data & security' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' }
  ];

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Slideout Panel */}
      <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-r border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Music className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <p className="text-sm text-gray-400">neurotune</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center p-4 text-left hover:bg-gray-800 rounded-lg transition-colors duration-200 group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 mr-4 transition-colors duration-200" />
                <div>
                  <div className="text-white font-medium group-hover:text-blue-100">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* User Section - Bottom */}
        <div className="border-t border-gray-700 bg-gray-800/50">
          {currentUser ? (
            /* Logged In User */
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">
                    {currentUser.name || 'User'}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {currentUser.email || 'user@example.com'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Member since {currentUser.joinDate || 'Jan 2024'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200">
                  <User className="w-4 h-4 mr-3" />
                  <span className="text-sm">View Profile</span>
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Logged In */
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="w-10 h-10 text-gray-400" />
              </div>
              <div className="text-gray-300 mb-4">
                <div className="font-medium">Welcome to neurotune</div>
                <div className="text-sm text-gray-400 mt-1">
                  Sign in to access your personal library and preferences
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
              >
                Sign In to Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideoutPane;