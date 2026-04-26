'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  opacityTarget: number;
  opacitySpeed: number;
  glowRadius: number;
  type: 'star' | 'orb'; // star = small sharp point, orb = soft glow blob
}

const GOLD = '212, 168, 83';
const CONNECT_DIST = 160;
const PARTICLE_COUNT = 55;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();

    // ── Spawn particles ────────────────────────────────────────────────────
    const spawn = (): Particle[] =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const isOrb = i < 8; // first 8 are large glowing orbs, rest are stars
        const speed = isOrb ? 0.12 + Math.random() * 0.1 : 0.18 + Math.random() * 0.28;
        const angle = Math.random() * Math.PI * 2;
        const op = 0.2 + Math.random() * 0.55;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: isOrb ? 2.5 + Math.random() * 2.5 : 1 + Math.random() * 1.5,
          opacity: op,
          opacityTarget: 0.1 + Math.random() * 0.7,
          opacitySpeed: 0.003 + Math.random() * 0.004,
          glowRadius: isOrb ? 40 + Math.random() * 60 : 12 + Math.random() * 20,
          type: isOrb ? 'orb' : 'star',
        };
      });

    particlesRef.current = spawn();

    // ── Draw loop ──────────────────────────────────────────────────────────
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, W, H);

      const pts = particlesRef.current;

      // Move particles
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -50) p.x = W + 50;
        else if (p.x > W + 50) p.x = -50;
        if (p.y < -50) p.y = H + 50;
        else if (p.y > H + 50) p.y = -50;

        // Breathe opacity
        if (p.opacity < p.opacityTarget) p.opacity = Math.min(p.opacityTarget, p.opacity + p.opacitySpeed);
        else p.opacity = Math.max(p.opacityTarget, p.opacity - p.opacitySpeed);
        if (Math.abs(p.opacity - p.opacityTarget) < 0.01) {
          p.opacityTarget = 0.08 + Math.random() * 0.65;
        }
      });

      // ── Draw connecting lines (constellation) ────────────────────────────
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineOpacity = (1 - dist / CONNECT_DIST) * 0.12 * Math.min(pts[i].opacity, pts[j].opacity);
            ctx.strokeStyle = `rgba(${GOLD}, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Draw particles ────────────────────────────────────────────────────
      pts.forEach((p) => {
        // Soft glow halo behind particle
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
        glow.addColorStop(0,   `rgba(${GOLD}, ${p.opacity * (p.type === 'orb' ? 0.22 : 0.14)})`);
        glow.addColorStop(0.4, `rgba(${GOLD}, ${p.opacity * 0.06})`);
        glow.addColorStop(1,   `rgba(${GOLD}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Sharp particle core
        const coreAlpha = p.type === 'orb' ? p.opacity * 0.9 : p.opacity;
        ctx.fillStyle = `rgba(${GOLD}, ${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra inner bright point for stars
        if (p.type === 'star' && p.opacity > 0.4) {
          ctx.fillStyle = `rgba(255, 240, 200, ${(p.opacity - 0.4) * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    tick();

    const onResize = () => { resize(); };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
