// src/components/Pricing.tsx
import React from 'react';
import { Check, X, Sparkles, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Perfect for getting started with virtual exhibitions',
    icon: Zap,
    popular: false,
    features: [
      { name: 'Your name on loading screen', included: false },
      { name: 'Walter AI guide', value: 'Basic' },
      { name: 'Speak any language', included: false },
      { name: 'Live visitor alerts', included: false },
      { name: 'Analytics', included: false },
      { name: 'Digitize real space', included: false },
      { name: 'Sell art online', included: false }
    ],
    cta: 'Get Started Free',
    ctaStyle: 'border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
  },
  {
    name: 'Standard',
    price: '$10',
    period: '/ mo¹',
    description: 'Ideal for active artists building their presence',
    icon: Sparkles,
    popular: true,
    features: [
      { name: 'Your name on loading screen', included: true },
      { name: 'Walter AI guide', value: 'Basic' },
      { name: 'Speak any language', included: true },
      { name: 'Live visitor alerts', included: true },
      { name: 'Analytics', value: 'Core' },
      { name: 'Digitize real space', value: '1 / yr' },
      { name: 'Sell art online', included: false }
    ],
    cta: 'Start Standard',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
  },
  {
    name: 'Premium',
    price: '$49',
    period: '/ mo¹',
    description: 'Complete solution for professional artists',
    icon: Crown,
    popular: false,
    features: [
      { name: 'Your name on loading screen', included: true },
      { name: 'Walter AI guide', value: 'Advanced' },
      { name: 'Speak any language', included: true },
      { name: 'Live visitor alerts', included: true },
      { name: 'Analytics', value: 'Deep + Export' },
      { name: 'Digitize real space', value: 'Unlimited*' },
      { name: 'Sell art online', included: true }
    ],
    cta: 'Go Premium',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Choose Your Exhibition Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From free galleries to professional showcases with advanced AI curation and analytics. Start free, upgrade when you're ready to grow.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500 shadow-2xl shadow-purple-500/20' 
                    : 'border-gray-700 hover:border-purple-500/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>
                
                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{feature.name}</span>
                      <div className="flex items-center">
                        {feature.included === true ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : feature.included === false ? (
                          <X className="h-5 w-5 text-gray-600" />
                        ) : (
                          <span className="text-purple-400 text-sm font-medium">
                            {feature.value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <button className={`w-full px-6 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 ${plan.ctaStyle}`}>
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ¹ Monthly billing. Annual plans available with 20% discount.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            * Fair use policy applies. Contact us for enterprise needs.
          </p>
        </div>
        
        {/* FAQ Link */}
        <div className="text-center mt-8">
          <button className="text-purple-400 hover:text-purple-300 underline transition-colors">
            Questions about pricing? View FAQ
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;