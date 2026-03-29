'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  children: React.ReactNode;
}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    {
      direction = 'up',
      delay = 0,
      duration = 0.6,
      stagger = false,
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
            gsap.set(element, {
              opacity: 1,
              x: 0,
              y: 0,
            });
            return;
          }

          // Calculate initial position based on direction
          const getInitialState = () => {
            const baseState = { opacity: 0 };

            switch (direction) {
              case 'up':
                return { ...baseState, y: 30 };
              case 'down':
                return { ...baseState, y: -30 };
              case 'left':
                return { ...baseState, x: 30 };
              case 'right':
                return { ...baseState, x: -30 };
              default:
                return { ...baseState, y: 30 };
            }
          };

          if (stagger) {
            // Stagger direct children
            const childElements = element.children;
            gsap.set(childElements, getInitialState());

            gsap.to(childElements, {
              opacity: 1,
              x: 0,
              y: 0,
              duration,
              stagger: 0.1,
              delay,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse',
                markers: false,
              },
            });
          } else {
            // Single element reveal
            gsap.fromTo(
              element,
              getInitialState(),
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration,
                delay,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: element,
                  start: 'top 80%',
                  end: 'top 20%',
                  toggleActions: 'play none none reverse',
                  markers: false,
                },
              }
            );
          }

          // Cleanup on unmount
          return () => {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
          };
        });
      });
    }, [divRef, direction, delay, duration, stagger]);

    return (
      <div
        ref={divRef}
        className={className}
        style={{
          willChange: 'transform, opacity',
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;
