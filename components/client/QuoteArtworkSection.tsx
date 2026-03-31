'use client';

import { useEffect, useRef } from 'react';

interface QuoteArtworkSectionProps {
  locale?: string;
}

export default function QuoteArtworkSection({ locale }: QuoteArtworkSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const isAr = locale === 'ar';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ default: ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        if (!section) return;

        // Layer 1 — background geometry — slowest
        if (layer1Ref.current) {
          gsap.fromTo(layer1Ref.current,
            { y: 0 },
            {
              y: -60,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          );
        }

        // Layer 2 — mid geometry — medium speed
        if (layer2Ref.current) {
          gsap.fromTo(layer2Ref.current,
            { y: 0 },
            {
              y: -110,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }

        // Layer 3 — foreground ornaments — fastest parallax
        if (layer3Ref.current) {
          gsap.fromTo(layer3Ref.current,
            { y: 0 },
            {
              y: -170,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }

        // Quote reveal
        if (quoteRef.current) {
          gsap.fromTo(quoteRef.current,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: quoteRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
      });
    });
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden py-40"
      style={{ minHeight: '600px' }}
    >
      {/* === LAYER 1 — Background Cairo Skyline (slowest) === */}
      <div
        ref={layer1Ref}
        className="pointer-events-none absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full opacity-[0.06]"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Cairo skyline silhouette */}
          {/* Pyramids of Giza far left */}
          <polygon points="60,520 160,300 260,520" fill="#D4A853" />
          <polygon points="120,520 200,340 280,520" fill="#D4A853" />
          <polygon points="175,520 240,370 305,520" fill="#D4A853" />
          {/* City buildings - center */}
          <rect x="400" y="380" width="30" height="140" fill="#D4A853" />
          <rect x="440" y="340" width="20" height="180" fill="#D4A853" />
          <rect x="470" y="360" width="40" height="160" fill="#D4A853" />
          <rect x="520" y="300" width="25" height="220" fill="#D4A853" />
          <rect x="555" y="360" width="35" height="160" fill="#D4A853" />
          {/* Cairo Tower */}
          <rect x="700" y="250" width="12" height="270" fill="#D4A853" />
          <ellipse cx="706" cy="248" rx="18" ry="26" fill="#D4A853" />
          {/* More buildings */}
          <rect x="850" y="350" width="30" height="170" fill="#D4A853" />
          <rect x="890" y="310" width="22" height="210" fill="#D4A853" />
          <rect x="920" y="370" width="45" height="150" fill="#D4A853" />
          <rect x="980" y="290" width="28" height="230" fill="#D4A853" />
          <rect x="1020" y="340" width="35" height="180" fill="#D4A853" />
          <rect x="1100" y="380" width="25" height="140" fill="#D4A853" />
          <rect x="1135" y="360" width="30" height="160" fill="#D4A853" />
          <rect x="1175" y="320" width="20" height="200" fill="#D4A853" />
          <rect x="1200" y="400" width="50" height="120" fill="#D4A853" />
          <rect x="1300" y="350" width="35" height="170" fill="#D4A853" />
          <rect x="1345" y="370" width="25" height="150" fill="#D4A853" />
          <rect x="1380" y="340" width="40" height="180" fill="#D4A853" />
          {/* Ground line */}
          <rect x="0" y="518" width="1440" height="6" fill="#D4A853" />
        </svg>
      </div>

      {/* === LAYER 2 — Mid Geometric Patterns (medium) === */}
      <div
        ref={layer2Ref}
        className="pointer-events-none absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Large decorative circles */}
          <circle cx="200" cy="150" r="120" stroke="#D4A853" strokeWidth="1" fill="none" />
          <circle cx="200" cy="150" r="80" stroke="#D4A853" strokeWidth="0.5" fill="none" />
          <circle cx="1240" cy="450" r="160" stroke="#D4A853" strokeWidth="1" fill="none" />
          <circle cx="1240" cy="450" r="100" stroke="#D4A853" strokeWidth="0.5" fill="none" />
          {/* Islamic star patterns */}
          <g transform="translate(720, 80) rotate(0)">
            <polygon points="0,-50 12,-17 47,-15 20,8 30,45 0,24 -30,45 -20,8 -47,-15 -12,-17" fill="#D4A853" opacity="0.6" />
          </g>
          <g transform="translate(180, 400) rotate(15)">
            <polygon points="0,-35 9,-12 33,-10 14,6 21,31 0,17 -21,31 -14,6 -33,-10 -9,-12" fill="#D4A853" opacity="0.4" />
          </g>
          <g transform="translate(1260, 120) rotate(-10)">
            <polygon points="0,-40 10,-14 38,-11 16,7 24,36 0,20 -24,36 -16,7 -38,-11 -10,-14" fill="#D4A853" opacity="0.4" />
          </g>
          {/* Horizontal rule lines */}
          <line x1="0" y1="280" x2="1440" y2="280" stroke="#D4A853" strokeWidth="0.5" strokeDasharray="4 8" />
          <line x1="0" y1="320" x2="1440" y2="320" stroke="#D4A853" strokeWidth="0.5" strokeDasharray="4 8" />
        </svg>
      </div>

      {/* === LAYER 3 — Foreground Ornaments (fastest) === */}
      <div
        ref={layer3Ref}
        className="pointer-events-none absolute inset-0"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full opacity-[0.12]"
        >
          {/* Small dots scattered */}
          {[
            [100, 80], [320, 200], [580, 50], [840, 180], [1050, 60], [1300, 140],
            [150, 500], [450, 490], [750, 520], [1000, 480], [1350, 510],
            [250, 300], [650, 280], [950, 320], [1200, 290],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#D4A853" />
          ))}
          {/* Diamond shapes */}
          <polygon points="60,300 80,270 100,300 80,330" fill="#D4A853" opacity="0.7" />
          <polygon points="1350,180 1370,155 1390,180 1370,205" fill="#D4A853" opacity="0.7" />
          <polygon points="700,520 720,500 740,520 720,540" fill="#D4A853" opacity="0.5" />
          {/* Thin vertical lines */}
          <line x1="30" y1="0" x2="30" y2="600" stroke="#D4A853" strokeWidth="0.5" opacity="0.3" />
          <line x1="1410" y1="0" x2="1410" y2="600" stroke="#D4A853" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* === Radial gradient vignette overlay === */}
      {/* Dark mode: dark vignette; Light mode: white vignette */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(13,13,13,0.85) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(248,248,249,0.9) 100%)',
        }}
      />

      {/* === Quote Content === */}
      <div
        ref={quoteRef}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
        style={{ opacity: 0 }}
      >
        <div className="mb-8 flex justify-center">
          <div className="h-px w-20 bg-gold/50" />
        </div>
        <blockquote className="text-3xl font-light leading-relaxed text-text-primary sm:text-4xl lg:text-5xl">
          {isAr ? (
            <>
              <span className="gradient-text font-bold">"</span>
              كل شخص استثنائي يستحق أن يُحتفى به
              <span className="gradient-text font-bold">"</span>
            </>
          ) : (
            <>
              <span className="gradient-text font-bold">"</span>
              Every remarkable person deserves to be celebrated
              <span className="gradient-text font-bold">"</span>
            </>
          )}
        </blockquote>
        <p className="mt-6 text-lg tracking-widest text-text-secondary uppercase">
          Cairo Live
        </p>
        <div className="mt-8 flex justify-center">
          <div className="h-px w-20 bg-gold/50" />
        </div>
      </div>
    </div>
  );
}
