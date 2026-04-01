'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Particle canvas ───────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

function initParticles(w: number, h: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1,
    alpha: Math.random() * 0.6 + 0.2,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
  }));
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ComingSoonClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  /* Canvas setup + animation */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height, 90);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    const GOLD = [212, 175, 55];     // #D4AF37
    const GOLD_BRIGHT = [255, 215, 0]; // #FFD700
    const LINK_DIST = 140;
    const MOUSE_DIST = 160;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const { x: mx, y: my } = mouseRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      /* Subtle radial glow at mouse */
      if (mx > 0 && mx < w) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_DIST);
        grd.addColorStop(0, `rgba(${GOLD_BRIGHT.join(',')},0.06)`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      /* Update + draw particles */
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        /* Mouse attraction */
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (1 - dist / MOUSE_DIST) * 0.015;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        /* Speed cap + damping */
        p.vx *= 0.98;
        p.vy *= 0.98;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx *= 1.5 / speed; p.vy *= 1.5 / speed; }

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        /* Wrap edges */
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        /* Draw connections to neighbours */
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const cx = p.x - q.x;
          const cy = p.y - q.y;
          const d = Math.sqrt(cx * cx + cy * cy);
          if (d < LINK_DIST) {
            const opacity = (1 - d / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${GOLD.join(',')},${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        /* Draw particle */
        const pulse = Math.sin(p.pulse) * 0.3 + 0.7;
        const alpha = p.alpha * pulse;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grd.addColorStop(0, `rgba(${GOLD_BRIGHT.join(',')},${alpha})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  /* Password submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/en');
    } else {
      setError('Incorrect password. Try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#080808] flex items-center justify-center overflow-hidden">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center select-none">

        {/* MOK Logo mark */}
        <div className="mb-8">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mokGold" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Hexagon border */}
            <path
              d="M36 4L64.5 20V52L36 68L7.5 52V20L36 4Z"
              stroke="url(#mokGold)" strokeWidth="1.5" fill="none" filter="url(#glow)"
            />
            {/* M letterform */}
            <path
              d="M18 48V26L27 38L36 26L45 38L54 26V48"
              stroke="url(#mokGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              fill="none" filter="url(#glow)"
            />
          </svg>
        </div>

        {/* Brand name */}
        <h1 className="text-2xl font-light tracking-[0.35em] uppercase text-white/90 mb-1">
          The Mok Company
        </h1>
        <div className="w-12 h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

        {/* Headline */}
        <p className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight tracking-tight">
          Something remarkable<br />is coming.
        </p>
        <p className="text-base text-white/40 mb-12 max-w-sm">
          We are putting the finishing touches on something worth waiting for.
        </p>

        {/* Password gate */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center gap-3">
          <div
            className={`w-full transition-transform duration-150 ${shake ? 'translate-x-[-8px]' : ''}`}
            style={{ animation: shake ? 'shake 0.5s ease' : undefined }}
          >
            <input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/25 text-center tracking-widest focus:outline-none focus:border-[#D4AF37]/60 focus:bg-white/8 transition-all duration-200"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400/80 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
              color: '#080808',
              boxShadow: '0 0 20px rgba(212,175,55,0.3)',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-16 text-white/15 text-xs tracking-wider">
          themok.company
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
