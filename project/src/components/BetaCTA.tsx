// src/components/BetaCTA.tsx
import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const BetaCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="beta" className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Join the Beta. Showcase Your Art Globally.
        </h2>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Be among the first artists to experience AI-powered virtual exhibitions. Limited beta spots available.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              disabled={isSubmitted}
              className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Submitted!</span>
                </>
              ) : (
                <>
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Free during beta period</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Setup takes 5 minutes</span>
          </div>
        </div>
        
        <div className="mt-8">
          <button className="text-gray-300 hover:text-white underline transition-colors">
            Questions? Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default BetaCTA;