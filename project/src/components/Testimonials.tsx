// src/components/Testimonals.tsx
import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Walter's Cube transformed my photography portfolio into an immersive experience. The AI curator perfectly captures my artistic vision.",
    author: "Sarah Chen",
    role: "Fine Art Photographer",
    rating: 5,
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=150&h=150&fit=crop"
  },
  {
    quote: "I've been painting for 20 years without gallery representation. Now I have a global audience engaging with my work 24/7.",
    author: "Marcus Rodriguez",
    role: "Contemporary Painter",
    rating: 5,
    image: "https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg?w=150&h=150&fit=crop"
  },
  {
    quote: "The analytics show me exactly which pieces resonate with collectors. It's like having a personal gallery manager.",
    author: "Elena Kowalski",
    role: "Sculptor",
    rating: 5,
    image: "https://images.pexels.com/photos/3184466/pexels-photo-3184466.jpeg?w=150&h=150&fit=crop"
  }
];

const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Trusted by Artists Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of artists who are already showcasing their work through AI-powered virtual exhibitions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-purple-500 opacity-50 absolute -top-2 -left-2" />
                <p className="text-gray-700 text-lg leading-relaxed pl-6">
                  {testimonial.quote}
                </p>
              </div>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;