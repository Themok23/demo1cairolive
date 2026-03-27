'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StaggerChildrenProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDuration?: number;
  delay?: number;
}

const StaggerChildren = React.forwardRef<
  HTMLDivElement,
  StaggerChildrenProps
>(
  (
    { children, staggerDuration = 0.1, delay = 0, className, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = ref || internalRef;

    useEffect(() => {
      if (!divRef || typeof divRef === 'function') return;

      const element = divRef.current;
      if (!element) return;

      const childElements = element.querySelectorAll('[data-stagger]');

      // Set initial state for all children
      gsap.set(childElements, { opacity: 0, y: 20 });

      // Stagger animation
      gsap.to(childElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: staggerDuration,
        delay,
        ease: 'power3.out',
      });
    }, [divRef, staggerDuration, delay]);

    return (
      <div ref={divRef} className={className} {...props}>
        {children}
      </div>
    );
  }
);

StaggerChildren.displayName = 'StaggerChildren';

export default StaggerChildren;
