'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<any>(null);
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import gsap
    import('gsap').then((gsapModule) => {
      gsapRef.current = gsapModule.default;

      const gsap = gsapRef.current;

      if (!containerRef.current) return;

      // Check for reduced motion preference
      const isReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (isReducedMotion) {
        gsap.set(containerRef.current, {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // Create exit animation (fade out + slight upward motion)
      const exitTimeline = gsap.timeline();

      // Create accent line animation
      const accentLine = document.createElement('div');
      accentLine.style.position = 'fixed';
      accentLine.style.top = '0';
      accentLine.style.left = '0';
      accentLine.style.width = '100%';
      accentLine.style.height = '3px';
      accentLine.style.background = 'linear-gradient(90deg, transparent, #D4A853, transparent)';
      accentLine.style.zIndex = '9999';
      accentLine.style.pointerEvents = 'none';
      accentLine.style.opacity = '0';
      document.body.appendChild(accentLine);

      // Animate entrance on route change
      const enterTimeline = gsap.timeline();

      enterTimeline
        // Fade in with slight downward settle
        .fromTo(
          containerRef.current,
          {
            opacity: 0,
            y: -20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          0
        )
        // Accent line animation
        .fromTo(
          accentLine,
          {
            opacity: 0,
            x: '-100%',
          },
          {
            opacity: 1,
            x: '0%',
            duration: 0.35,
            ease: 'power1.inOut',
          },
          0
        )
        .to(
          accentLine,
          {
            opacity: 0,
            x: '100%',
            duration: 0.35,
            ease: 'power1.inOut',
          }
        );

      // Cleanup accent line after animation
      enterTimeline.eventCallback('onComplete', () => {
        document.body.removeChild(accentLine);
      });

      // Cleanup on unmount
      return () => {
        enterTimeline.kill();
        if (accentLine && accentLine.parentNode) {
          accentLine.parentNode.removeChild(accentLine);
        }
      };
    });
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

export default PageTransitionProvider;
