import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CarouselMobileProps {
    items: React.ReactNode[];
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    className?: string;
}

export const CarouselMobile: React.FC<CarouselMobileProps> = ({
    items,
    autoPlay = true,
    interval = 5000,
    showDots = true,
    className = '',
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);


    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        setTouchEndX(e.changedTouches[0].clientX);
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToNext();
            else goToPrevious();
        }
    };

    useEffect(() => {
        if (autoPlay) {
            timerRef.current = setInterval(goToNext, interval);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [autoPlay, interval, goToNext]);

    return (
        <div
            className={`block md:hidden relative w-full overflow-hidden rounded-lg ${className}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Carousel"
        >
            <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full shrink-0">
                        {item}
                    </div>
                ))}
            </div>

            {showDots && items.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5" role="tablist">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-blue-600 dark:bg-blue-400 w-6'
                                    : 'bg-gray-400 dark:bg-gray-600'
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