import React, { useState, useEffect } from 'react';
import { LuArrowRight } from 'react-icons/lu';

const slides = [
  {
    id: 0,
    title: 'Capturing Moments,\nCreating Memories',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2070&auto=format&fit=crop', // Desert dune image
  },
  {
    id: 1,
    title: 'Connect with Creators,\nShare Your Story',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Discover New Horizons,\nGrow Together',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop',
  },
];

const AppIntro: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-l-2xl overflow-hidden flex flex-col justify-between p-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slides[currentSlide].image}
          alt="App Intro"
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <h1 className="text-white text-3xl font-bold tracking-widest">AMU</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-sm transition-colors">
          Back to website
          <LuArrowRight size={16} />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 flex flex-col items-center text-center mt-auto">
        <h2 className="text-white text-3xl md:text-4xl font-semibold leading-tight mb-8 whitespace-pre-line transition-all duration-500">
          {slides[currentSlide].title}
        </h2>

        {/* Carousel Indicators */}
        <div className="flex gap-2 mb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-white' : 'w-4 bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppIntro