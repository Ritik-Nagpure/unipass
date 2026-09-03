import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CarouselWebProps {
    items: React.ReactNode[];
    autoPlay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    className?: string;
}

export const CarouselWeb: React.FC<CarouselWebProps> = ({
    items,
    autoPlay = true,
    interval = 5000,
    showArrows = true,
    showDots = true,
    className = '',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);


    const goToIndex = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    useEffect(() => {
        if (autoPlay && !isHovered) {
            timerRef.current = setInterval(goToNext, interval);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoPlay, interval, isHovered, goToNext]);

    return (
        <div
            className={`hidden md:block relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="region"
            aria-label="Carousel"
        >
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full shrink-0 px-2">
                        {item}
                    </div>
                ))}
            </div>

            {showArrows && items.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {showDots && items.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2" role="tablist">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === currentIndex
                                ? 'bg-blue-600 dark:bg-blue-400 w-8'
                                : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                            role="tab"
                            aria-selected={index === currentIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};