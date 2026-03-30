'use client';

import React, { useEffect, useRef } from 'react';

interface ParallaxSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  direction?: 'up' | 'down';
  children: React.ReactNode;
}

const ParallaxSection = React.forwardRef<HTMLDivElement, ParallaxSectionProps>(
  (
    {
      speed = 0.5,
      direction = 'up',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const gsapRef = useRef<any>(null);
    const ScrollTriggerRef = useRef<any>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;

      // Dynamically import gsap with SSR: false
      import('gsap').then((gsapModule) => {
        import('gsap/ScrollTrigger').then((ScrollTriggerModule) => {
          gsapRef.current = gsapModule.default;
          ScrollTriggerRef.current = ScrollTriggerModule.default;

          const gsap = gsapRef.current;
          const ScrollTrigger = ScrollTriggerModule.default;

          // Register ScrollTrigger plugin
          gsap.registerPlugin(ScrollTrigger);

          if (!divRef || typeof divRef === 'function') return;

          const element = divRef.current;
          if (!element) return;

          const isReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

          if (isReducedMotion) {
            gsap.set(element, { y: 0 });
            return;
          }

          const multiplier = direction === 'up' ? -1 : 1;

          gsap.fromTo(
            element,
            {
              y: 0,
            },
            {
              y: multiplier * 50 * speed,
              scrollTrigger: {
                trigger: element,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                markers: false,
              },
            }
          );

          // Cleanup on unmount
          return () => {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
          };
        });
      });
    }, [divRef, speed, direction]);

    return (
      <div
        ref={divRef}
        className={className}
        style={{
          willChange: 'transform',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ParallaxSection.displayName = 'ParallaxSection';

export default ParallaxSection;
