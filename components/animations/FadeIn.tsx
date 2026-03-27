'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number;
  delay?: number;
}

const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, duration = 0.6, delay = 0, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = ref || internalRef;

    useEffect(() => {
      if (!divRef || typeof divRef === 'function') return;

      const element = divRef.current;
      if (!element) return;

      // Set initial state
      gsap.set(element, { opacity: 0, y: 20 });

      // Animate in
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
      });
    }, [divRef, duration, delay]);

    return (
      <div ref={divRef} className={className} {...props}>
        {children}
      </div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

export default FadeIn;
