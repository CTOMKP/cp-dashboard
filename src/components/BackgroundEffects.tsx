"use client";

const symbols = [
  { char: "$", top: "12%", left: "8%", delay: "0s", duration: "18s" },
  { char: "%", top: "22%", left: "88%", delay: "2s", duration: "22s" },
  { char: "↗", top: "68%", left: "6%", delay: "4s", duration: "20s" },
  { char: "⧉", top: "78%", left: "92%", delay: "1s", duration: "24s" },
  { char: "◎", top: "45%", left: "94%", delay: "3s", duration: "19s" },
  { char: "∞", top: "55%", left: "4%", delay: "5s", duration: "21s" },
  { char: "USDC", top: "18%", left: "72%", delay: "2.5s", duration: "26s", small: true },
  { char: "20%", top: "82%", left: "78%", delay: "1.5s", duration: "23s", small: true },
];

export function FloatingSymbols() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {symbols.map((s) => (
        <span
          key={`${s.char}-${s.top}`}
          className={`floating-symbol ${s.small ? "text-xs tracking-wider" : "text-2xl"}`}
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

export function AuroraOrbs({ intensity = "hero" }: { intensity?: "hero" | "subtle" }) {
  const scale = intensity === "hero" ? 1 : 0.6;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="aurora-orb aurora-orb-pink"
        style={{ width: `${480 * scale}px`, height: `${480 * scale}px`, top: "-10%", left: "-5%" }}
      />
      <div
        className="aurora-orb aurora-orb-orange"
        style={{ width: `${400 * scale}px`, height: `${400 * scale}px`, top: "20%", right: "-8%" }}
      />
      <div
        className="aurora-orb aurora-orb-magenta"
        style={{ width: `${350 * scale}px`, height: `${350 * scale}px`, bottom: "-5%", left: "30%" }}
      />
      {intensity === "hero" && (
        <div
          className="aurora-orb aurora-orb-orange"
          style={{ width: "280px", height: "280px", bottom: "15%", right: "20%", animationDelay: "-4s" }}
        />
      )}
    </div>
  );
}

export function PerspectiveGrid() {
  return (
    <div className="perspective-grid pointer-events-none absolute inset-x-0 bottom-0 h-[55%]" aria-hidden />
  );
}

export function CryptoNetwork() {
  return (
    <svg
      className="crypto-network pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF2E91" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF9F0A" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {[
        [120, 180, 340, 120],
        [340, 120, 580, 200],
        [580, 200, 820, 100],
        [820, 100, 1050, 220],
        [200, 400, 450, 350],
        [450, 350, 700, 420],
        [700, 420, 950, 380],
        [120, 180, 200, 400],
        [340, 120, 450, 350],
        [580, 200, 700, 420],
        [820, 100, 950, 380],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#lineGrad)"
          strokeWidth="1"
          className="network-line"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {[
        [120, 180],
        [340, 120],
        [580, 200],
        [820, 100],
        [1050, 220],
        [200, 400],
        [450, 350],
        [700, 420],
        [950, 380],
      ].map(([cx, cy], i) => (
        <g key={`node-${i}`}>
          <circle cx={cx} cy={cy} r="6" fill="#0A0A0A" stroke="#FF2E91" strokeWidth="1.5" className="network-node" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle cx={cx} cy={cy} r="12" fill="none" stroke="#FF2E91" strokeWidth="0.5" opacity="0.3" className="network-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
        </g>
      ))}
    </svg>
  );
}

export function ParticleField({ count = 40 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 23 + 11) % 100}%`,
    delay: `${(i * 0.7) % 8}s`,
    duration: `${12 + (i % 10)}s`,
    size: i % 3 === 0 ? "3px" : "2px",
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

export function ScanLine() {
  return <div className="scan-line pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />;
}

export function HexPattern({ opacity = 0.04 }: { opacity?: number }) {
  return (
    <div
      className="hex-pattern pointer-events-none absolute inset-0"
      style={{ opacity }}
      aria-hidden
    />
  );
}

export function SectionGlow({
  color = "pink",
  position = "top-right",
}: {
  color?: "pink" | "orange" | "both";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";
}) {
  const posClasses: Record<string, string> = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <div className={`pointer-events-none absolute ${posClasses[position]} h-full w-full overflow-hidden`} aria-hidden>
      {(color === "pink" || color === "both") && (
        <div className={`section-glow section-glow-pink ${posClasses[position]}`} />
      )}
      {(color === "orange" || color === "both") && (
        <div
          className={`section-glow section-glow-orange ${posClasses[position]}`}
          style={{ animationDelay: "-3s" }}
        />
      )}
    </div>
  );
}

export function OrbitRing({ className = "" }: { className?: string }) {
  return (
    <div className={`orbit-ring pointer-events-none absolute ${className}`} aria-hidden>
      <div className="orbit-ring-inner" />
      <div className="orbit-dot" />
    </div>
  );
}

export function FlowLines() {
  return (
    <svg
      className="flow-lines pointer-events-none absolute inset-0 h-full w-full opacity-30"
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M0,200 Q300,100 600,200 T1200,200" fill="none" stroke="#FF2E91" strokeWidth="1" className="flow-path" />
      <path d="M0,250 Q400,350 800,250 T1200,250" fill="none" stroke="#FF9F0A" strokeWidth="1" className="flow-path" style={{ animationDelay: "-2s" }} />
    </svg>
  );
}

export function MarqueeTicker({ className = "" }: { className?: string }) {
  const items = [
    "USDC PAYOUTS",
    "6% PLATFORM FEE",
    "LIVE REFERRAL TRACKING",
    "FOREVER ATTRIBUTION",
    "WEB3 MARKETPLACE",
    "BUILDER TIER 15%",
    "PARTNER TIER 20%",
  ];

  return (
    <div
      className={`ticker-wrap overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
            <span className="mx-8 text-accent-pink">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
