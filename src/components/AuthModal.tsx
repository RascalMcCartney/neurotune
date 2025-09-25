import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, provider }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen || !provider) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Here you would handle the actual authentication
    console.log('Auth attempt:', { provider, email, isLogin });
    onClose();
  };

  const handleSocialAuth = async (providerName: string) => {
    setIsLoading(true);
    
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    console.log(`${providerName} auth attempted`);
    onClose();
  };

  const getProviderIcon = (providerName: string) => {
    switch (providerName) {
      case 'Google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'Microsoft':
        return (
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
        );
      case 'Apple':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      default:
        return <Lock className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700/50 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            {getProviderIcon(provider)}
            <h2 className="text-2xl font-bold text-white ml-3">
              {provider === 'Email' ? (isLogin ? 'Sign In' : 'Sign Up') : `Continue with ${provider}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Social Auth Button (for non-email providers) */}
        {provider !== 'Email' ? (
          <div className="space-y-6">
            <button
              onClick={() => handleSocialAuth(provider)}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-600 bg-gray-800 rounded-lg hover:border-gray-500 hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-3" />
              ) : (
                <div className="mr-3">{getProviderIcon(provider)}</div>
              )}
              <span className="text-white font-medium">
                {isLoading ? 'Connecting...' : `Continue with ${provider}`}
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-gray-400">or</span>
              </div>
            </div>

            <button
              onClick={() => setProvider('Email')}
              className="w-full flex items-center justify-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5 mr-2" />
              Use email instead
            </button>
          </div>
        ) : (
          /* Email Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <p className="text-sm text-green-300">
              Your data is protected with industry-standard encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;