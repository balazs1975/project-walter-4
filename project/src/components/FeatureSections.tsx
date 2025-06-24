// src/components/FeatureSections.tsx
import React from 'react';
import { Upload, Bot, Share2, TrendingUp, ArrowRight } from 'lucide-react';

const features = [
  {
    id: 'amplify',
    icon: Upload,
    title: 'Amplify Your Art',
    description: 'Upload your artworks and watch them transform into professional virtual exhibitions',
    benefits: [
      'Auto-layout with intelligent frame selection',
      'Professional digitization service for 3D objects',
      'Instant gallery creation with AI curation',
      'Multiple exhibition themes and layouts'
    ],
    cta: 'See It in Action',
    visual: 'upload'
  },
  {
    id: 'connect',
    icon: Bot,
    title: 'Connect with Collectors',
    description: 'Walter, your AI curator, engages visitors 24/7 in multiple languages',
    benefits: [
      'Train Walter with your artistic concepts and biography',
      'Multilingual support for global reach',
      'Intelligent artwork descriptions and context',
      'Real-time visitor engagement and Q&A'
    ],
    cta: 'Meet Walter',
    visual: 'bot'
  },
  {
    id: 'grow',
    icon: Share2,
    title: 'Grow Your Reach',
    description: 'Share your exhibitions globally with powerful distribution tools',
    benefits: [
      'Shareable links for social media and email',
      'Embeddable exhibition widgets',
      'Multi-language localization',
      'SEO-optimized exhibition pages'
    ],
    cta: 'Share Your Gallery',
    visual: 'share'
  },
  {
    id: 'understand',
    icon: TrendingUp,
    title: 'Understand Your Audience',
    description: 'Get detailed insights into how visitors interact with your art',
    benefits: [
      'Real-time visitor analytics dashboard',
      'Artwork engagement heatmaps',
      'Collector interest notifications',
      'Performance tracking and reports'
    ],
    cta: 'View Sample Report',
    visual: 'analytics'
  }
];

const FeatureSections = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={feature.id}
              className={`grid lg:grid-cols-2 gap-12 items-center mb-32 last:mb-0 ${
                isEven ? '' : 'lg:grid-flow-col-dense'
              }`}
            >
              {/* Content */}
              <div className={isEven ? 'lg:pr-8' : 'lg:pl-8 lg:col-start-2'}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">{feature.title}</h2>
                </div>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-4 mb-8">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 flex items-center space-x-2">
                  <span>{feature.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              
              {/* Visual */}
              <div className={isEven ? 'lg:pl-8' : 'lg:pr-8 lg:col-start-1 lg:row-start-1'}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 h-96 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <IconComponent className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">Interactive Demo</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Live Preview
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeatureSections;