import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Scale, 
  AlertCircle, 
  Shield, 
  Users, 
  Gavel,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';

const TermsOfServicePage: React.FC = () => {
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
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                <p className="text-gray-400">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 text-sm">
                  Please read these terms carefully before using neurotune. By using our service, you agree to be bound by these terms.
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
                <Scale className="w-6 h-6 mr-3 text-blue-400" />
                Agreement to Terms
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  Welcome to neurotune ("Company," "we," "our," or "us"). These Terms of Service ("Terms") 
                  govern your use of our music discovery and organization platform, including our website, mobile 
                  applications, and related services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. 
                  If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </div>
            </section>

            {/* Service Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-green-400" />
                Description of Service
              </h2>
              
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  neurotune provides a platform that allows users to discover, organize, and analyze 
                  music. Our Service includes but is not limited to:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Core Features</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Music library organization</li>
                      <li>• Track analysis and metadata</li>
                      <li>• Playlist creation and management</li>
                      <li>• Music discovery tools</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Advanced Tools</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• BPM and key detection</li>
                      <li>• Genre classification</li>
                      <li>• Audio analysis</li>
                      <li>• Social sharing features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-purple-400" />
                User Accounts and Responsibilities
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Account Creation</h3>
                  <div className="text-gray-300 space-y-3">
                    <p>To use certain features of our Service, you must create an account. You agree to:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and update your information as necessary</li>
                      <li>Keep your account credentials secure</li>
                      <li>Be responsible for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Acceptable Use</h3>
                  <div className="text-gray-300 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          You May
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Use the Service for personal purposes</li>
                          <li>• Upload your own music files</li>
                          <li>• Create and share playlists</li>
                          <li>• Interact with other users respectfully</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-red-400 mb-2 flex items-center">
                          <XCircle className="w-4 h-4 mr-2" />
                          You May Not
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Upload copyrighted content illegally</li>
                          <li>• Violate any applicable laws</li>
                          <li>• Harass or harm other users</li>
                          <li>• Attempt to hack or disrupt the Service</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Gavel className="w-6 h-6 mr-3 text-orange-400" />
                Intellectual Property Rights
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Our Content</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The Service and its original content, features, and functionality are owned by neurotune 
                    and are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                    property laws. You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, 
                    license, create derivative works from, transfer, or sell any information or content from the Service 
                    without our prior written consent.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Content</h3>
                  <div className="text-gray-300 space-y-3">
                    <p className="text-sm">
                      You retain ownership of any content you upload to the Service ("User Content"). By uploading 
                      User Content, you grant us a non-exclusive, worldwide, royalty-free license to:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                      <li>Store, process, and analyze your content to provide the Service</li>
                      <li>Display your content to you and users you choose to share with</li>
                      <li>Create backups and ensure service reliability</li>
                      <li>Improve our algorithms and features (in anonymized form)</li>
                    </ul>
                    <p className="text-sm bg-amber-900/20 border border-amber-700/50 rounded p-3 mt-4">
                      <strong>Important:</strong> You are solely responsible for ensuring you have the right to upload 
                      and share any content you submit to our Service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-400" />
                Privacy and Data Protection
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection and use of your personal information is governed 
                  by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/privacy" 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center"
                  >
                    Read our Privacy Policy
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3 text-yellow-400" />
                Service Availability and Modifications
              </h2>
              
              <div className="text-gray-300 space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Service Availability</h3>
                  <p className="text-sm">
                    We strive to provide continuous access to our Service, but cannot guarantee 100% uptime. 
                    We may need to suspend or restrict access for maintenance, updates, or other operational reasons.
                  </p>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-semibold text-white mb-2">Service Modifications</h3>
                  <p className="text-sm">
                    We reserve the right to modify, suspend, or discontinue any part of our Service at any time. 
                    We will provide reasonable notice for significant changes that affect core functionality.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers and Limitations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Scale className="w-6 h-6 mr-3 text-red-400" />
                Disclaimers and Limitation of Liability
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Service "As Is"</h3>
                  <p className="text-red-200 text-sm">
                    The Service is provided on an "as is" and "as available" basis. We make no warranties or 
                    representations about the accuracy or completeness of the Service's content or the content 
                    of any sites linked to the Service.
                  </p>
                </div>

                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Limitation of Liability</h3>
                  <p className="text-red-200 text-sm">
                    To the fullest extent permitted by law, neurotune shall not be liable for any 
                    indirect, incidental, special, consequential, or punitive damages, including without 
                    limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <XCircle className="w-6 h-6 mr-3 text-gray-400" />
                Termination
              </h2>
              
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                  <p className="text-gray-300 text-sm">
                    You may terminate your account at any time by contacting us or using the account deletion 
                    feature in your settings. Upon termination, your right to use the Service will cease immediately.
                  </p>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-3">Our Rights</h3>
                  <p className="text-gray-300 text-sm">
                    We may terminate or suspend your account immediately, without prior notice or liability, 
                    for any reason, including breach of these Terms. Upon termination, we will delete your 
                    personal data in accordance with our Privacy Policy, unless we are required to retain it by law.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Gavel className="w-6 h-6 mr-3 text-indigo-400" />
                Governing Law and Dispute Resolution
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <div className="text-gray-300 space-y-4 text-sm">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
                    without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising out of or relating to these Terms or the Service shall be resolved through 
                    binding arbitration in accordance with the rules of [Arbitration Organization]. The arbitration 
                    shall be conducted in [City, State/Country], and the language of the arbitration shall be English.
                  </p>
                </div>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-green-400" />
                Changes to These Terms
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 leading-relaxed text-sm">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days advance notice before any new terms take effect. Material 
                  changes will be communicated via email or prominent notice on our Service.
                </p>
                <p className="text-gray-300 leading-relaxed text-sm mt-4">
                  Your continued use of the Service after changes become effective constitutes acceptance of 
                  the revised Terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <ExternalLink className="w-6 h-6 mr-3 text-purple-400" />
                Contact Information
              </h2>
              
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 mb-4 text-sm">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong>Email:</strong> legal@neurotune.studio</p>
                  <p><strong>Response time:</strong> 5 business days</p>
                  <p><strong>Address:</strong> [Your Business Address]</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium"
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

export default TermsOfServicePage;