'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
}

const ParallaxHero = React.forwardRef<HTMLDivElement, ParallaxHeroProps>(
  ({ children, speed = 0.5, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = ref || internalRef;

    useEffect(() => {
      if (!divRef || typeof divRef === 'function') return;

      const element = divRef.current;
      if (!element) return;

      gsap.to(element, {
        y: (index, target) => {
          return gsap.utils.unitize(
            (1 - speed) *
              ScrollTrigger.getScrollPosition() *
              0.5
          );
        },
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          scrub: true,
          onUpdate: (self) => {
            gsap.set(element, {
              y: self.getVelocity() * speed * 0.1,
            });
          },
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
