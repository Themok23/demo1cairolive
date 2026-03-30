'use client';

import React, { useEffect, useRef } from 'react';

interface ParallaxHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

const ParallaxHero = React.forwardRef<HTMLDivElement, ParallaxHeroProps>(
  ({ children, speed = 0.5, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = ref || internalRef;

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (!divRef || typeof divRef === 'function') return;

      const element = divRef.current;
      if (!element) return;

      let gsapInstance: any = null;

      import('gsap').then((gsapModule) => {
        gsapInstance = gsapModule.default;
      });

      const handleScroll = () => {
        if (!gsapInstance) return;
        const scrollPosition = window.scrollY;
        const yOffset = scrollPosition * speed * 0.3;
        gsapInstance.set(element, { y: yOffset });
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [divRef, speed]);

    return (
      <div ref={divRef} className={className} {...props}>
        {children}
      </div>
    );
  }
);

ParallaxHero.displayName = 'ParallaxHero';

export default ParallaxHero;
