import { useEffect, useRef, useState, useCallback } from 'react';

// ─── 3D Developer Icon Mark (Code & Terminal Emblem) ───────────────────────────
// Iconic developer symbol: Glowing 3D Code Brackets & Slash (</>) + Terminal Prompt
// inside a sleek rounded 3D Cyber Microchip frame. Pure developer identity!
function ShieldCoreSVG({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ display: 'block' }}
    >
      <defs>
        {/* Neon Developer Gradients */}
        <linearGradient id="devGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="devGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
        </linearGradient>

        <linearGradient id="chipBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
        </linearGradient>

        <radialGradient id="devCoreGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#a855f7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#06080d" stopOpacity="0" />
        </radialGradient>

        <filter id="devIconGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#devIconGlow)">
        {/* Background Ambient Glow */}
        <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#devCoreGlow)" />

        {/* Outer 3D Cyber Chip Frame */}
        <rect
          x="7"
          y="7"
          width="50"
          height="50"
          rx="13"
          fill="rgba(10, 14, 23, 0.88)"
          stroke="url(#chipBorderGrad)"
          strokeWidth="2"
        />

        {/* Inner Microchip Inset Line */}
        <rect
          x="12"
          y="12"
          width="40"
          height="40"
          rx="9"
          fill="none"
          stroke="rgba(34, 211, 238, 0.25)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* Chip Pin Contacts (Top, Bottom, Left, Right) */}
        <line x1="22" y1="3" x2="22" y2="7" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="2" x2="32" y2="7" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="3" x2="42" y2="7" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />

        <line x1="22" y1="57" x2="22" y2="61" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="32" y1="57" x2="32" y2="62" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="42" y1="57" x2="42" y2="61" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />

        <line x1="3" y1="22" x2="7" y2="22" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="32" x2="7" y2="32" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="3" y1="42" x2="7" y2="42" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />

        <line x1="57" y1="22" x2="61" y2="22" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="57" y1="32" x2="62" y2="32" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="57" y1="42" x2="61" y2="42" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── CODE BRACKETS & SLASH (</>) DEV EMBLEM ── */}

        {/* Left Opening Bracket '<' */}
        <polyline
          points="23,24 16,32 23,40"
          fill="none"
          stroke="url(#devGradCyan)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Forward Slash '/' */}
        <line
          x1="35"
          y1="21"
          x2="29"
          y2="43"
          stroke="url(#chipBorderGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Right Closing Bracket '>' */}
        <polyline
          points="41,24 48,32 41,40"
          fill="none"
          stroke="url(#devGradPurple)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Terminal Dot Prompts */}
        <circle cx="16" cy="16" r="1.5" fill="#ef4444" opacity="0.8" />
        <circle cx="21" cy="16" r="1.5" fill="#f59e0b" opacity="0.8" />
        <circle cx="26" cy="16" r="1.5" fill="#10b981" opacity="0.8" />

        {/* Glowing Terminal Cursor Blinking Dot / Node */}
        <circle cx="49" cy="40" r="1.8" fill="#34d399" />
      </g>
    </svg>
  );
}

// ─── Particle System for Hero ──────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  dist: number;
  opacity: number;
  color: string;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  const colors = ['#22d3ee', '#a78bfa', '#67e8f9', '#c084fc', '#38bdf8', '#818cf8'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    size: 1.5 + Math.random() * 2.5,
    speed: 0.3 + Math.random() * 0.8,
    angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
    dist: 80 + Math.random() * 90,
    opacity: 0.3 + Math.random() * 0.6,
    color: colors[i % colors.length],
    delay: Math.random() * Math.PI * 2,
  }));
}

// ─── Floating Data Fragments ───────────────────────────────────────────────────
const DATA_FRAGMENTS = [
  { text: '0x4F', x: -120, y: -60, z: 45, color: '#22d3ee' },
  { text: 'SEC', x: 130, y: -40, z: 55, color: '#a78bfa' },
  { text: '>>_', x: -100, y: 70, z: 35, color: '#34d399' },
  { text: 'API', x: 115, y: 80, z: 65, color: '#60a5fa' },
  { text: '⬡', x: -60, y: -100, z: 50, color: '#c084fc' },
  { text: '////', x: 80, y: -95, z: 40, color: '#22d3ee' },
  { text: 'λ', x: -130, y: 10, z: 60, color: '#f472b6' },
  { text: 'K8S', x: 135, y: 20, z: 30, color: '#34d399' },
];

// ─── Main Export ───────────────────────────────────────────────────────────────
export function CyberRepoLogoAnimation({ size = 'header' }: { size?: 'header' | 'hero' }) {
  const isHero = size === 'hero';

  if (!isHero) {
    return <HeaderLogo />;
  }

  return <HeroLogo />;
}

// ─── HEADER LOGO ───────────────────────────────────────────────────────────────
function HeaderLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer select-none group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D Shield Icon */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          transformStyle: 'preserve-3d',
          transform: hovered ? 'rotateY(12deg) rotateX(-5deg) scale(1.08)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
          transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Ambient glow behind icon */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.3) 0%, rgba(168,85,247,0.15) 50%, transparent 100%)',
            animation: 'logo-core-pulse 3s ease-in-out infinite',
            filter: 'blur(6px)',
            transform: 'translateZ(-5px)',
          }}
        />
        <div style={{ animation: 'logo-hex-breathe 4s ease-in-out infinite' }}>
          <ShieldCoreSVG size={36} />
        </div>
      </div>

      {/* Text */}
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-base font-black text-white tracking-tight font-display" style={{ fontFamily: "'Orbitron', 'Space Grotesk', monospace" }}>
            CYBER
            <span
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #a855f7, #22d3ee)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'holographic-shimmer 4s linear infinite',
              }}
            >
              REPO
            </span>
          </h1>
          <span className="px-1.5 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            MULTI-ECOSYSTEM
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-tight hidden sm:block font-mono">
          SECURITY · AI · WEB · DEVOPS · SYSTEMS
        </p>
      </div>
    </div>
  );
}

// ─── HERO LOGO ─────────────────────────────────────────────────────────────────
function HeroLogo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);
  const particles = useRef(generateParticles(24)).current;
  const rafRef = useRef<number>(0);
  const startRef = useRef(performance.now());

  // Mouse-reactive tilt
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 18, y: dx * 18 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Animation loop for particles + time
  useEffect(() => {
    startRef.current = performance.now();
    const loop = () => {
      setTick(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const elapsed = tick;
  const canvasW = 360;
  const canvasH = 400;
  const cx = canvasW / 2;
  const cy = canvasH / 2 - 20;

  return (
    <div
      ref={containerRef}
      className="relative select-none cursor-pointer"
      style={{
        width: canvasW,
        height: canvasH,
        perspective: '1200px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Transform container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* ── Layer 0: Deep ambient glow ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: cy - 120,
            left: cx - 120,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(168,85,247,0.1) 40%, rgba(99,102,241,0.05) 65%, transparent 100%)',
            filter: 'blur(40px)',
            animation: 'logo-core-pulse 4s ease-in-out infinite',
            transform: 'translateZ(-40px)',
          }}
        />

        {/* ── Layer 1: Outer orbital ring (slow) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: cy - 100,
            left: cx - 100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(34,211,238,0.15)',
            animation: 'logo-ring-orbit 20s linear infinite',
            transform: 'translateZ(-15px) rotateX(65deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Orbital dot markers */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#22d3ee',
                boxShadow: '0 0 8px #22d3ee',
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(100px) translateY(-2px)`,
              }}
            />
          ))}
        </div>

        {/* ── Layer 2: Mid orbital ring (faster, tilted opposite) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: cy - 75,
            left: cx - 75,
            width: 150,
            height: 150,
            borderRadius: '50%',
            border: '1px dashed rgba(168,85,247,0.2)',
            animation: 'logo-ring-orbit 14s linear infinite reverse',
            transform: 'translateZ(-5px) rotateX(70deg) rotateZ(30deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {[45, 135, 225, 315].map((deg) => (
            <div
              key={deg}
              className="absolute"
              style={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: '#a78bfa',
                boxShadow: '0 0 6px #a78bfa',
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(75px) translateY(-1.5px)`,
              }}
            />
          ))}
        </div>

        {/* ── Layer 3: Inner close ring ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: cy - 55,
            left: cx - 55,
            width: 110,
            height: 110,
            borderRadius: '50%',
            border: '1px solid rgba(99,102,241,0.15)',
            animation: 'logo-ring-orbit 10s linear infinite',
            transform: 'translateZ(5px) rotateX(75deg) rotateZ(-20deg)',
          }}
        />

        {/* ── Layer 4: Scan line sweep ── */}
        <div
          className="absolute pointer-events-none overflow-hidden"
          style={{
            top: cy - 80,
            left: cx - 80,
            width: 160,
            height: 160,
            borderRadius: '12px',
            transform: 'translateZ(10px)',
          }}
        >
          <div
            className="absolute w-full"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)',
              animation: 'logo-scanline 4s ease-in-out infinite',
            }}
          />
        </div>

        {/* ── Layer 5: Main Shield Core ── */}
        <div
          className="absolute"
          style={{
            top: cy - 65,
            left: cx - 65,
            width: 130,
            height: 130,
            transform: 'translateZ(25px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Shield glow aura */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(168,85,247,0.12) 40%, transparent 70%)',
              filter: 'blur(15px)',
              animation: 'logo-core-pulse 3s ease-in-out infinite',
              borderRadius: '20%',
            }}
          />

          {/* The actual shield SVG */}
          <div
            style={{
              width: '100%',
              height: '100%',
              animation: 'logo-hex-breathe 5s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCoreSVG size={130} />
          </div>
        </div>

        {/* ── Layer 6: Particle field ── */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={canvasW}
          height={canvasH}
          style={{ transform: 'translateZ(15px)' }}
        >
          {particles.map((p) => {
            const t = elapsed * 0.001 * p.speed + p.delay;
            const px = cx + Math.cos(p.angle + t * 0.5) * (p.dist + Math.sin(t * 1.5) * 15);
            const py = cy + Math.sin(p.angle + t * 0.5) * (p.dist * 0.6 + Math.cos(t * 1.2) * 10);
            const flicker = 0.4 + Math.sin(t * 3 + p.delay) * 0.3;
            return (
              <circle
                key={p.id}
                cx={px}
                cy={py}
                r={p.size * flicker}
                fill={p.color}
                opacity={p.opacity * flicker}
              />
            );
          })}
        </svg>

        {/* ── Layer 7: Floating data fragments ── */}
        {DATA_FRAGMENTS.map((frag, i) => {
          const floatY = Math.sin(elapsed * 0.001 + i * 0.8) * 8;
          const floatX = Math.cos(elapsed * 0.0008 + i * 1.1) * 4;
          return (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                top: cy + frag.y + floatY,
                left: cx + frag.x + floatX,
                transform: `translateZ(${frag.z}px)`,
                color: frag.color,
                fontSize: '10px',
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                opacity: 0.45 + Math.sin(elapsed * 0.002 + i) * 0.2,
                textShadow: `0 0 8px ${frag.color}`,
                letterSpacing: '1px',
              }}
            >
              {frag.text}
            </div>
          );
        })}

        {/* ── Layer 8: Cinematic title typography ── */}
        <div
          className="absolute w-full text-center"
          style={{
            bottom: 40,
            left: 0,
            transform: 'translateZ(30px)',
          }}
        >
          {/* Glitch shadow */}
          <div
            className="relative"
            style={{ marginBottom: 6 }}
          >
            <h2
              style={{
                fontFamily: "'Orbitron', 'Space Grotesk', monospace",
                fontWeight: 900,
                fontSize: '34px',
                letterSpacing: '3px',
                lineHeight: 1,
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(34,211,238,0.15)',
                transform: 'translate(-1.5px, 1px)',
              }}
            >
              CYBERREPO
            </h2>
            <h2
              style={{
                fontFamily: "'Orbitron', 'Space Grotesk', monospace",
                fontWeight: 900,
                fontSize: '34px',
                letterSpacing: '3px',
                lineHeight: 1,
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                color: 'rgba(168,85,247,0.15)',
                transform: 'translate(1.5px, -1px)',
              }}
            >
              CYBERREPO
            </h2>

            {/* Main text */}
            <h2
              style={{
                fontFamily: "'Orbitron', 'Space Grotesk', monospace",
                fontWeight: 900,
                fontSize: '34px',
                letterSpacing: '3px',
                lineHeight: 1,
                position: 'relative',
              }}
            >
              <span
                style={{
                  color: 'white',
                  filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.25))',
                }}
              >
                CYBER
              </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a855f7, #818cf8, #22d3ee)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'holographic-shimmer 5s linear infinite',
                  filter: 'drop-shadow(0 0 16px rgba(168,85,247,0.5))',
                }}
              >
                REPO
              </span>
            </h2>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '9px',
              letterSpacing: '5px',
              color: 'rgba(161,161,170,0.75)',
              marginTop: 28,
            }}
          >
            YOUR CONTROL CENTER.
          </p>

          {/* Separator line */}
          <div
            style={{
              width: 240,
              height: 1,
              margin: '8px auto',
              background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(168,85,247,0.3), transparent)',
            }}
          />

          {/* Sub-pills */}
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '8px',
              letterSpacing: '5px',
              color: 'rgba(139,92,246,0.6)',
            }}
          >
            FIND ✦ FORK ✦ LEARN ✦ BUILD
          </p>
        </div>

        {/* ── Pulse rings (outer decorative) ── */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: cy - (100 + i * 25),
              left: cx - (100 + i * 25),
              width: (100 + i * 25) * 2,
              height: (100 + i * 25) * 2,
              borderRadius: '50%',
              border: `1px solid rgba(34,211,238,${0.12 - i * 0.03})`,
              animation: `logo-core-pulse ${3 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
              transform: 'translateZ(-20px)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
