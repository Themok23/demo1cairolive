'use client';

import { useEffect, useRef } from 'react';

interface BokehOrb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
  magneticStrength: number;
}

interface FloatingBox {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  width: number;
  height: number;
  opacity: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  cornerRadius: number;
  parallaxStrength: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bokehOrbsRef = useRef<BokehOrb[]>([]);
  const floatingBoxesRef = useRef<FloatingBox[]>([]);
  const dprRef = useRef<number>(1);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    dprRef.current = dpr;

    const setCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    // Initialize bokeh orbs (6-7 large, very faint, gold) with cursor interaction
    const bokehOrbs: BokehOrb[] = [];
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      bokehOrbs.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: 80 + Math.random() * 120,
        opacity: 0.04 + Math.random() * 0.04,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.001 + Math.random() * 0.001,
        magneticStrength: 0.005 + Math.random() * 0.005,
      });
    }
    bokehOrbsRef.current = bokehOrbs;

    // Initialize floating boxes (8 faded, very faint gold borders) with parallax
    const floatingBoxes: FloatingBox[] = [];
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      floatingBoxes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        width: 40 + Math.random() * 80,
        height: 40 + Math.random() * 80,
        opacity: 0.03 + Math.random() * 0.02,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.0005,
        cornerRadius: 4 + Math.random() * 8,
        parallaxStrength: 0.02 + Math.random() * 0.03,
      });
    }
    floatingBoxesRef.current = floatingBoxes;

    // Draw rounded rectangle helper
    const drawRoundedRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!prefersReducedMotion) {
        // Update and draw bokeh orbs
        bokehOrbs.forEach((orb) => {
          // Calculate distance to cursor for magnetic effect
          const dx = mouseRef.current.x - orb.baseX;
          const dy = mouseRef.current.y - orb.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const attractionRadius = 300;

          // Magnetic attraction/repulsion (very subtle)
          if (distance < attractionRadius && distance > 0) {
            const force = (1 - distance / attractionRadius) * orb.magneticStrength;
            orb.vx += (dx / distance) * force;
            orb.vy += (dy / distance) * force;
          }

          // Damping
          orb.vx *= 0.98;
          orb.vy *= 0.98;

          // Update position
          orb.x += orb.vx;
          orb.y += orb.vy;

          // Soft return to base position
          const returnForce = 0.001;
          orb.vx += (orb.baseX - orb.x) * returnForce;
          orb.vy += (orb.baseY - orb.y) * returnForce;

          // Wrap around edges
          if (orb.x - orb.radius > window.innerWidth) {
            orb.x = -orb.radius;
            orb.baseX = orb.x;
          } else if (orb.x + orb.radius < 0) {
            orb.x = window.innerWidth + orb.radius;
            orb.baseX = orb.x;
          }

          if (orb.y - orb.radius > window.innerHeight) {
            orb.y = -orb.radius;
            orb.baseY = orb.y;
          } else if (orb.y + orb.radius < 0) {
            orb.y = window.innerHeight + orb.radius;
            orb.baseY = orb.y;
          }

          // Update pulse
          orb.pulsePhase += orb.pulseSpeed;
          const pulseFactor = 0.95 + Math.sin(orb.pulsePhase) * 0.05;

          // Draw bokeh orb with radial gradient
          const gradient = ctx.createRadialGradient(
            orb.x,
            orb.y,
            0,
            orb.x,
            orb.y,
            orb.radius * pulseFactor
          );
          gradient.addColorStop(0, `rgba(212, 168, 83, ${orb.opacity * 1.5})`);
          gradient.addColorStop(0.5, `rgba(212, 168, 83, ${orb.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(212, 168, 83, 0)`);

          ctx.fillStyle = gradient;
          ctx.fillRect(
            orb.x - orb.radius * pulseFactor,
            orb.y - orb.radius * pulseFactor,
            orb.radius * pulseFactor * 2,
            orb.radius * pulseFactor * 2
          );
        });

        // Update and draw floating boxes
        floatingBoxes.forEach((box) => {
          // Parallax effect based on cursor position
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const cursorOffsetX = (mouseRef.current.x - centerX) * box.parallaxStrength;
          const cursorOffsetY = (mouseRef.current.y - centerY) * box.parallaxStrength;

          // Update position with gentle floating
          box.x += box.vx;
          box.y += box.vy;

          // Apply parallax displacement
          const displayX = box.x + cursorOffsetX;
          const displayY = box.y + cursorOffsetY;

          // Wrap around edges
          if (box.x > window.innerWidth + 100) {
            box.x = -100;
            box.baseX = box.x;
          } else if (box.x < -100) {
            box.x = window.innerWidth + 100;
            box.baseX = box.x;
          }

          if (box.y > window.innerHeight + 100) {
            box.y = -100;
            box.baseY = box.y;
          } else if (box.y < -100) {
            box.y = window.innerHeight + 100;
            box.baseY = box.y;
          }

          // Update rotation
          box.rotation += box.rotationSpeed;

          // Draw floating box
          ctx.save();
          ctx.translate(displayX, displayY);
          ctx.rotate(box.rotation);

          ctx.strokeStyle = `rgba(212, 168, 83, ${box.opacity})`;
          ctx.lineWidth = 1;
          drawRoundedRect(
            -box.width / 2,
            -box.height / 2,
            box.width,
            box.height,
            box.cornerRadius
          );
          ctx.stroke();

          ctx.restore();
        });
      }
    };

    // Track mouse position
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
