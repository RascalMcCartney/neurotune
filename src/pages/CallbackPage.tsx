import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Music, 
  ArrowLeft,
  Shield,
  Key,
  Clock
} from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';

interface CallbackStatus {
  status: 'loading' | 'success' | 'error' | 'expired';
  message: string;
  details?: string;
  redirectUrl?: string;
}

const CallbackPage: React.FC = () => {
  const [callbackStatus, setCallbackStatus] = useState<CallbackStatus>({
    status: 'loading',
    message: 'Processing authentication...'
  });

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Simulate callback processing
    const processCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (error) {
          setCallbackStatus({
            status: 'error',
            message: 'Authentication failed',
            details: `Error: ${error}. Please try signing in again.`
          });
          return;
        }

        if (!code) {
          setCallbackStatus({
            status: 'error',
            message: 'Invalid callback',
            details: 'No authorization code received. Please try the authentication process again.'
          });
          return;
        }

        // Simulate successful authentication
        setCallbackStatus({
          status: 'success',
          message: 'Authentication successful!',
          details: 'You have been successfully signed in. Redirecting to your dashboard...',
          redirectUrl: '/'
        });

        // Start countdown for redirect
        let timeLeft = 5;
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft === 0) {
            clearInterval(timer);
            window.location.href = '/';
          }
        }, 1000);

      } catch (error) {
        setCallbackStatus({
          status: 'error',
          message: 'Processing error',
          details: 'An unexpected error occurred while processing your authentication. Please try again.'
        });
      }
    };

    processCallback();
  }, []);

  const getStatusIcon = () => {
    switch (callbackStatus.status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'error':
      case 'expired':
        return <XCircle className="w-16 h-16 text-red-400" />;
      default:
        return <Music className="w-16 h-16 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (callbackStatus.status) {
      case 'loading':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
      case 'expired':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AuthHeader />
      
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Authentication Callback</h1>
                  <p className="text-blue-100">Processing your sign-in request</p>
                </div>
              </div>
              <Link
                to="/"
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8 py-12">
            <div className="max-w-2xl mx-auto text-center">
              {/* Status Icon */}
              <div className="flex justify-center mb-6">
                {getStatusIcon()}
              </div>

              {/* Status Message */}
              <h2 className={`text-3xl font-bold mb-4 ${getStatusColor()}`}>
                {callbackStatus.message}
              </h2>

              {callbackStatus.details && (
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {callbackStatus.details}
                </p>
              )}

              {/* Success State - Countdown */}
              {callbackStatus.status === 'success' && (
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center space-x-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">
                      Redirecting in <span className="font-bold text-white">{countdown}</span> seconds...
                    </span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {callbackStatus.status === 'loading' && (
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center space-x-3">
                    <Key className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">
                      Securely processing your authentication...
                    </span>
                  </div>
                </div>
              )}

              {/* Error State - Action Buttons */}
              {(callbackStatus.status === 'error' || callbackStatus.status === 'expired') && (
                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center space-x-3">
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">
                        Authentication could not be completed
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/"
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      Try Again
                    </Link>
                    <Link
                      to="/"
                      className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              )}

              {/* Success State - Manual Actions */}
              {callbackStatus.status === 'success' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium"
                  >
                    Continue Now
                  </button>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Security Notice</h3>
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  • All authentication data is encrypted and transmitted securely
                </p>
                <p>
                  • Your session will be established using industry-standard protocols
                </p>
                <p>
                  • No sensitive information is stored in local browser storage
                </p>
                <p>
                  • If you did not initiate this sign-in, please contact support immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CallbackPage;