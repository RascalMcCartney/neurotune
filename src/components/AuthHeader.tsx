import React, { useState } from 'react';
import { Music, User, X, Menu, Settings, HelpCircle, LogOut, UserCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import SlideoutPane from './SlideoutPane';

const AuthHeader: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showSlideout, setShowSlideout] = useState(false);
  
  // Mock user data - in a real app this would come from your auth state
  const [currentUser, setCurrentUser] = useState<any>(null);

  const authProviders = [
    {
      name: 'Microsoft',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" >
  <path id="Imported Path #4"
        fill="none" stroke="white" stroke-width="1"
        d="M 0.00,0.00
           C 0.00,0.00 23.00,0.00 23.00,0.00
             23.00,0.00 23.00,23.00 23.00,23.00
             23.00,23.00 0.00,23.00 0.00,23.00
             0.00,23.00 0.00,0.00 0.00,0.00 Z" />
  <path id="Imported Path #3"
        fill="#f35325" stroke="white" stroke-width="1"
        d="M 1.00,1.00
           C 1.00,1.00 11.00,1.00 11.00,1.00
             11.00,1.00 11.00,11.00 11.00,11.00
             11.00,11.00 1.00,11.00 1.00,11.00
             1.00,11.00 1.00,1.00 1.00,1.00 Z" />
  <path id="Imported Path #2"
        fill="#81bc06" stroke="white" stroke-width="1"
        d="M 12.00,1.00
           C 12.00,1.00 22.00,1.00 22.00,1.00
             22.00,1.00 22.00,11.00 22.00,11.00
             22.00,11.00 12.00,11.00 12.00,11.00
             12.00,11.00 12.00,1.00 12.00,1.00 Z" />
  <path id="Imported Path #1"
        fill="#05a6f0" stroke="white" stroke-width="1"
        d="M 1.00,12.00
           C 1.00,12.00 11.00,12.00 11.00,12.00
             11.00,12.00 11.00,22.00 11.00,22.00
             11.00,22.00 1.00,22.00 1.00,22.00
             1.00,22.00 1.00,12.00 1.00,12.00 Z" />
  <path id="Imported Path"
        fill="#ffba08" stroke="white" stroke-width="1"
        d="M 12.00,12.00
           C 12.00,12.00 22.00,12.00 22.00,12.00
             22.00,12.00 22.00,22.00 22.00,22.00
             22.00,22.00 12.00,22.00 12.00,22.00
             12.00,22.00 12.00,12.00 12.00,12.00 Z" />
        </svg>
      ),
      color: 'hover:bg-gray-50 border-gray-300'
    },
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: 'hover:bg-blue-50 border-gray-300'
    },
    {
      name: 'Apple',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      color: 'hover:bg-gray-50 border-gray-300'
    }
  ];

  const handleProviderClick = (providerName: string) => {
    setSelectedProvider(providerName);
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setSelectedProvider(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-left h-16">
            {/* Left Side - Burger Menu + Logo */}
            <div className="flex items-left space-x-4">
              <button
                onClick={() => setShowSlideout(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative">
                <img src="/neurotune-purple-blue.svg" alt="neurotune logo" className="drop-shadow-lg rounded-lg" style={{ height: '60px' }} />
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">neurotune</h1>
                  <p className="text-xs text-gray-400">Neurotune – From waveform to wonder.</p>
                </div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-300 hidden lg:inline">Sign in with:</span>
              
              {/* Social Provider Buttons */}
              <div className="flex items-center space-x-2">
                {authProviders.map((provider) => (
                  <button
                    key={provider.name}
                    onClick={() => handleProviderClick(provider.name)}
                    className="flex items-center justify-center w-11 h-11 bg-gray-800 border border-gray-600 rounded-xl transition-all duration-200 hover:border-gray-500 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    title={`Sign in with ${provider.name}`}
                  >
                    <div className="text-white">
                      {provider.icon}
                    </div>
                  </button>
                ))}
              </div>

              {/* Traditional Login Button */}
              <div className="ml-2 pl-6 border-l border-gray-600">
                <button
                  onClick={() => handleProviderClick('Email')}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 font-medium shadow-lg hover:shadow-yellow-500/30 animate-pulse-gold"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={closeModal}
        provider={selectedProvider}
      />

      {/* Slideout Pane */}
      <SlideoutPane
        isOpen={showSlideout}
        onClose={() => setShowSlideout(false)}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />
    </>
  );
};

export default AuthHeader;