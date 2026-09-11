import React, { useState, useEffect } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import logo from '../../../../../public/favicon.png'

const slides = [
  {
    id: 0,
    title: 'Secure Logins,\nAuthorize Access',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 1,
    title: 'Manage Passwords,\nAllow or Revoke Access',
    image:
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Multi-Factor Authentication,\nAdding Another Layer of Security',
    image:
      'https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=2070&auto=format&fit=crop',
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
    <div className="relative w-full h-full min-h-150 rounded-l-2xl overflow-hidden flex flex-col justify-between p-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={slides[currentSlide].image}
          alt="App Intro"
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <h1 className="text-white text-3xl font-bold tracking-widest flex gap-4 items-center">
          <img src={logo} alt='unipass logo' width={40}/> UNIPASS
        </h1>
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-sm transition-colors">
          Back to website
          <LuArrowRight size={16} />
        </button> */}
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
              className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'w-4 bg-white/40'
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