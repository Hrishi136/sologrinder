
import React, { useEffect, useState } from 'react';

interface AnimatedStatCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedStatCounter({ 
  value, 
  duration = 800, 
  suffix = '', 
  className = '' 
}: AnimatedStatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === displayValue) return;

    setIsAnimating(true);
    const startValue = displayValue;
    const difference = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (difference * easeOutCubic));
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, displayValue, duration]);

  return (
    <span 
      className={`transition-all duration-200 ${isAnimating ? 'text-system-blue scale-110' : ''} ${className}`}
    >
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}
