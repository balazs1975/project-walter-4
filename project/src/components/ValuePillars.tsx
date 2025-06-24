// src/components/ValuePillars.tsx
import React from 'react';
import { Zap, Users, TrendingUp, BarChart3 } from 'lucide-react';

const pillars = [
  {
    icon: Zap,
    title: 'Amplify Your Art',
    description: 'Transform your physical artworks into immersive digital experiences'
  },
  {
    icon: Users,
    title: 'Connect with Collectors',
    description: 'Engage with art enthusiasts through AI-powered conversations'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Reach',
    description: 'Share your exhibitions globally with instant accessibility'
  },
  {
    icon: BarChart3,
    title: 'Understand Your Audience',
    description: 'Get insights into visitor behavior and engagement patterns'
  }
];

const ValuePillars = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePillars;