// src/components/NewsAndNoteworthy.tsx
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const posts = [
  {
    title: "Sculpture Digitized in Minutes",
    excerpt: "How 3D scanning technology is revolutionizing art preservation and exhibition",
    date: "Dec 15, 2024",
    image: "https://i.pinimg.com/736x/22/4e/a7/224ea7569739951b746d1d9c7e4630d2.jpg",
    category: "Technology"
  },
  {
    title: "Walter's First Exhibition",
    excerpt: "Behind the scenes of our AI curator's debut virtual gallery launch",
    date: "Dec 12, 2024",
    image: "https://i.pinimg.com/736x/d3/28/6e/d3286eb4e86ab5dd53657b0fb3d9e629.jpg",
    category: "Case Study"
  },
  {
    title: "Global Reach, Local Impact",
    excerpt: "How virtual exhibitions are connecting artists with collectors worldwide",
    date: "Dec 10, 2024",
    image: "https://i.pinimg.com/474x/fc/9d/af/fc9dafe49d1de6094e9f1d83afa3b0bd.jpg",
    category: "Success Story"
  }
];

const NewsAndNoteworthy = () => {
  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            New & Noteworthy
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest developments in AI-powered art exhibitions and success stories from our artist community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {post.date}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-2 transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:border-gray-500 hover:text-white transition-all">
            View All Updates
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsAndNoteworthy;