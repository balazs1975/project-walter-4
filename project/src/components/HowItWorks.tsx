// src/components/HowItWorks.tsx
import React from 'react';
import { Upload, Wand2, Share2, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Art',
    description: 'Upload digital images or use our digitization service for physical pieces',
    details: 'Support for paintings, photographs, sculptures, and graphic designs'
  },
  {
    icon: Wand2,
    title: 'AI Creates Your Gallery',
    description: 'Walter automatically curates and designs your virtual exhibition space',
    details: 'Intelligent layout, lighting, and presentation optimization'
  },
  {
    icon: Share2,
    title: 'Train & Share',
    description: 'Train Walter with your artistic vision and share your gallery worldwide',
    details: 'Custom AI responses, multilingual support, and social sharing'
  },
  {
    icon: BarChart3,
    title: 'Track & Grow',
    description: 'Monitor visitor engagement and grow your collector network',
    details: 'Real-time analytics, visitor insights, and performance metrics'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From upload to exhibition in minutes. Our AI-powered platform handles the technical complexity so you can focus on what matters most—your art.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-purple-500 to-transparent z-0"></div>
                )}
                
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    {step.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105">
            Start Your Exhibition Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;