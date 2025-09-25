import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Users, 
  Zap, 
  Target, 
  Heart, 
  Star,
  ArrowLeft,
  Award,
  TrendingUp,
  Shield,
  Headphones,
  Disc,
  Radio,
  Sparkles
} from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Music,
      title: 'Music Library Organization',
      description: 'Organise your entire music collection with smart folders, tags, and metadata management.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Advanced Audio Analysis',
      description: 'Automatic BPM detection, key analysis, and genre classification powered by AI.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Smart Discovery',
      description: 'Discover new music based on your taste preferences and listening patterns.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Social Playlists',
      description: 'Create and share playlists with friends, collaborate on music curation.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Active Users', icon: Users },
    { number: '10M+', label: 'Tracks Analysed', icon: Disc },
    { number: '1M+', label: 'Playlists Created', icon: Radio },
    { number: '99.9%', label: 'Uptime', icon: Shield }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former Spotify engineer with a passion for music discovery algorithms.',
      image: null
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      bio: 'Full-stack developer specialising in audio processing and machine learning.',
      image: null
    },
    {
      name: 'Emily Watson',
      role: 'Head of Design',
      bio: 'UX designer focused on creating intuitive music experiences.',
      image: null
    },
    {
      name: 'David Kim',
      role: 'Lead Audio Engineer',
      bio: 'Audio technology expert with 15+ years in digital signal processing.',
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <AuthHeader />
      
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                  <Music className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">About neurotune</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're passionate about helping music lovers discover, organise, and enjoy their music 
              in entirely new ways. Our mission is to create the most powerful and intuitive music 
              management platform on the planet.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Discover</h3>
                <p className="text-gray-300">
                  Help you find new music that perfectly matches your taste and mood, 
                  using advanced AI and community insights.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Organize</h3>
                <p className="text-gray-300">
                  Provide powerful tools to organize, analyze, and manage your music 
                  library with intelligent metadata and smart categorization.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Experience</h3>
                <p className="text-gray-300">
                  Create magical music experiences through innovative features, 
                  social sharing, and personalised recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Makes Us Special</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with intuitive design to create 
              tools that both casual listeners and music professionals love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
              <p className="text-blue-100">
                Join a growing community of music enthusiasts worldwide
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're a diverse team of musicians, engineers, and designers united by our 
              love for music and technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 text-center hover:border-gray-600 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Built with Modern Technology</h2>
              <p className="text-gray-400 text-lg">
                We use the latest technologies to ensure fast, reliable, and secure music management.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Audio Processing</h3>
                <p className="text-gray-300 text-sm">
                  Advanced algorithms for audio analysis, BPM detection, and key identification.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
                <p className="text-gray-300 text-sm">
                  Enterprise-grade security with encrypted storage and secure user authentication.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Machine Learning</h3>
                <p className="text-gray-300 text-sm">
                  AI-powered recommendations and smart categorisation that learns from your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Music Experience?</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of music lovers who have already revolutionised how they discover, 
              organise, and enjoy their music.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold flex items-center justify-center"
              >
                <Music className="w-5 h-5 mr-2" />
                Start Exploring
              </Link>
              <button className="px-8 py-4 bg-purple-700 hover:bg-purple-800 text-white rounded-lg transition-colors duration-200 font-semibold">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;