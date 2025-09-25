import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Lock, 
  Server, 
  Cookie, 
  Mail, 
  Calendar,
  ArrowLeft,
  ExternalLink,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AuthHeader />
      
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-blue-200 text-sm">
                  We are committed to protecting your privacy and being transparent about how we handle your data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
          <div className="p-8 prose prose-invert prose-blue max-w-none">
            
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-blue-400" />
                Introduction
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Welcome to neurotune ("we," "our," or "us"). This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use our music discovery and organization platform.
                </p>
                <p>
                  By using our service, you consent to the data practices described in this policy. If you do not 
                  agree with the terms of this Privacy Policy, please do not access or use our service.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Server className="w-6 h-6 mr-3 text-green-400" />
                Information We Collect
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                  <div className="text-gray-300 space-y-2">
                    <p>We may collect personal information that you provide directly to us, including:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Name and email address when you create an account</li>
                      <li>Profile information and preferences</li>
                      <li>Music library data and playlists you create</li>
                      <li>Communication preferences and settings</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Usage Information</h3>
                  <div className="text-gray-300 space-y-2">
                    <p>We automatically collect certain information about how you use our service:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Device information (browser type, operating system, device identifiers)</li>
                      <li>Log data (IP address, access times, pages viewed)</li>
                      <li>Music listening patterns and preferences</li>
                      <li>Search queries and interaction data</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Cookies and Tracking</h3>
                  <div className="text-gray-300 space-y-2">
                    <p>We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Maintain your login session</li>
                      <li>Remember your preferences and settings</li>
                      <li>Analyze usage patterns and improve our service</li>
                      <li>Provide personalized content and recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-purple-400" />
                How We Use Your Information
              </h2>
              
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>We use the information we collect to:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Service Operations</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Provide and maintain our service</li>
                      <li>• Process your transactions</li>
                      <li>• Authenticate your identity</li>
                      <li>• Respond to your requests</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Personalization</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Customize your experience</li>
                      <li>• Provide music recommendations</li>
                      <li>• Remember your preferences</li>
                      <li>• Improve our algorithms</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Communication</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Send service notifications</li>
                      <li>• Provide customer support</li>
                      <li>• Share product updates</li>
                      <li>• Marketing (with consent)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Analytics</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Analyze usage patterns</li>
                      <li>• Monitor service performance</li>
                      <li>• Identify improvement opportunities</li>
                      <li>• Generate insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Server className="w-6 h-6 mr-3 text-orange-400" />
                Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">We DO NOT sell your personal data</h3>
                  </div>
                  <p className="text-red-200 text-sm">
                    We never sell, rent, or trade your personal information to third parties for their marketing purposes.
                  </p>
                </div>

                <div className="text-gray-300 space-y-4">
                  <p>We may share your information in the following limited circumstances:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-semibold text-white mb-2">Service Providers</h4>
                      <p className="text-sm text-gray-300">
                        We may share information with trusted third-party service providers who assist us in operating 
                        our platform, conducting business, or serving you.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-semibold text-white mb-2">Legal Requirements</h4>
                      <p className="text-sm text-gray-300">
                        We may disclose information if required by law, court order, or to protect our rights, 
                        property, or safety, or that of others.
                      </p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="font-semibold text-white mb-2">Business Transfers</h4>
                      <p className="text-sm text-gray-300">
                        In the event of a merger, acquisition, or sale of assets, user information may be 
                        transferred as part of that transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-400" />
                Data Security
              </h2>
              
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Technical Safeguards</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• SSL/TLS encryption</li>
                      <li>• Secure data centers</li>
                      <li>• Access controls</li>
                      <li>• Regular security audits</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Administrative Safeguards</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Employee training</li>
                      <li>• Privacy policies</li>
                      <li>• Data minimization</li>
                      <li>• Incident response plans</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-3 text-green-400" />
                Your Privacy Rights
              </h2>
              
              <div className="text-gray-300 space-y-4">
                <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Access & Portability</h4>
                    <p className="text-sm text-gray-300">
                      Request access to your personal data and receive a copy in a portable format.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Correction</h4>
                    <p className="text-sm text-gray-300">
                      Request correction of inaccurate or incomplete personal information.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Deletion</h4>
                    <p className="text-sm text-gray-300">
                      Request deletion of your personal information, subject to certain exceptions.
                    </p>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Opt-Out</h4>
                    <p className="text-sm text-gray-300">
                      Opt out of certain data processing activities and marketing communications.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-purple-400" />
                Contact Us
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 mb-4">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">General Inquiries</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Email: privacy@neurotune.studio</p>
                      <p>Response time: 72 hours</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-3">Data Protection Officer</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Email: dpo@neurotune.studio</p>
                      <p>For privacy rights requests</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-yellow-400" />
                Policy Updates
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  Significant changes will be communicated via email or prominent notice on our service.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;