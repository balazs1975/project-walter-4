// src/components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import LoginModal from './LoginModal';

const animalSymbols = [
  { emoji: '🦁', name: 'Lion',  color: 'from-amber-400 to-orange-500' },
  { emoji: '🦅', name: 'Eagle', color: 'from-blue-400 to-indigo-500' },
  { emoji: '🐺', name: 'Wolf',  color: 'from-gray-400 to-slate-500' },
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  // const [loginOpen, setLoginOpen]         = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentAnimal(prev => (prev + 1) % animalSymbols.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartExhibition = () => {
    // Completely bypass any authentication - direct navigation
    console.log('Navigating directly to create exhibition - authentication disabled');
    navigate('/create-exhibition');
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-medium">
                AI-Powered Virtual Exhibitions
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Virtual Gallery.{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Powered by AI.
              </span>{' '}
              No gallery required.
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Upload flat artworks (painting, photo, graphic design, works on paper) or object pieces via our digitization service — then instantly exhibit them in a sleek, shareable virtual space. With Walter, your AI curator and multilingual guide, your art speaks for itself 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartExhibition}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Start Your Exhibition (Beta)</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-500 hover:text-white transition-all">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Beta Available Now</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>Free During Beta</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/30">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>

                <div className="relative h-48 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-lg flex items-center justify-center overflow-hidden">
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-600 ${
                      isTransitioning ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className={`bg-gradient-to-br ${animalSymbols[currentAnimal].color} w-24 h-24 rounded-full flex items-center justify-center shadow-2xl`}>
                      <span className="text-4xl" role="img" aria-label={animalSymbols[currentAnimal].name}>
                        {animalSymbols[currentAnimal].emoji}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className={`bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-600 ${
                      isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                    }`}>
                      <span className="text-white font-medium text-sm">
                        {animalSymbols[currentAnimal].name} Gallery
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 mt-4">
                  {animalSymbols.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setCurrentAnimal(idx);
                          setIsTransitioning(false);
                        }, 300);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentAnimal
                          ? 'bg-white scale-125'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              AI Walter
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              Live Exhibition
            </div>
          </div>
        </div>
      </div>

      {/* Completely removed LoginModal */}
    </section>
  );
};

export default Hero;