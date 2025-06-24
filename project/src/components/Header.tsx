// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

interface HeaderProps {
  hasUnsavedData?: boolean;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ hasUnsavedData = false, onNavigateHome }) => {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [loginOpen, setLoginOpen]     = useState(false);
  const navigate                      = useNavigate();
  const location                      = useLocation();
  const { user, loading, logout }     = useAuth();

  const handleLogoClick = () => {
    if (
      hasUnsavedData
      && ['/create-exhibition', '/train-walter'].includes(location.pathname)
    ) {
      onNavigateHome?.();
    } else {
      navigate('/');
    }
  };

  const handleNavClick = (href: string) => {
    if (
      hasUnsavedData
      && ['/create-exhibition', '/train-walter'].includes(location.pathname)
    ) {
      onNavigateHome?.();
      return;
    }
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Walter's Cube</span>
            <span className="text-sm text-gray-400 hidden sm:inline">For Artists</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('#why')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Why Walter's Cube
            </button>
            <button
              onClick={() => handleNavClick('#how-it-works')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('#pricing')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('#beta')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Beta Signup
            </button>
            <button
              onClick={() => handleNavClick('#contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-6 h-6 border-2 border-purple-500 rounded-full animate-spin" />
            ) : user ? (
              <button
                onClick={logout}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </button>
            )}
            <button
              onClick={() =>
                user
                  ? navigate('/create-exhibition')
                  : setLoginOpen(true)
              }
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105"
            >
              Get Started (Beta)
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4 px-4">
              <button
                onClick={() => handleNavClick('#why')}
                className="text-gray-300 hover:text-white text-left"
              >
                Why Walter's Cube
              </button>
              <button
                onClick={() => handleNavClick('#how-it-works')}
                className="text-gray-300 hover:text-white text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('#pricing')}
                className="text-gray-300 hover:text-white text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('#beta')}
                className="text-gray-300 hover:text-white text-left"
              >
                Beta Signup
              </button>
              <button
                onClick={() => handleNavClick('#contact')}
                className="text-gray-300 hover:text-white text-left"
              >
                Contact
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-purple-500 rounded-full animate-spin mx-auto" />
                ) : user ? (
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-white text-left"
                  >
                    Log out
                  </button>
                ) : (
                  <button
                    onClick={() => setLoginOpen(true)}
                    className="text-gray-300 hover:text-white text-left"
                  >
                    Log in
                  </button>
                )}
                <button
                  onClick={() =>
                    user
                      ? navigate('/create-exhibition')
                      : setLoginOpen(true)
                  }
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Get Started (Beta)
                </button>
              </div>
            </div>
          </div>
        )}

        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
