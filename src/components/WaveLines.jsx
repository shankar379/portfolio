import './WaveLines.css';

// Lightweight SVG echo of the hero's WebGL ribbon shader — same diagonal
// slope, same layered sine waves, same palette — at near-zero runtime cost.
// One animated canvas lives in the hero; everywhere else uses these.
// Motion: each path SMIL-morphs through phase-shifted copies of itself
// (0 → 2π/3 → 4π/3 → 2π), which loops seamlessly and reads as a flowing wave.

const PALETTE = {
  c1: '#ff4800',
  c4: '#ff6d00',
  c5: '#ff7900',
  c6: '#ff8500',
  c8: '#ff9e00',
  c9: '#ffaa00',
  c10: '#ffb600'
};

// Mirrors the shader's wave(): sin(x·f) · a + sin(x·f·1.3) · a/2, on a diagonal.
const buildPath = (width, { yOffset, amp, slope, freq, phase = 0 }) => {
  const steps = 72;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const t = (i / steps) * Math.PI * 2;
    const y =
      yOffset +
      x * slope +
      Math.sin(t * freq + phase) * amp +
      Math.sin(t * freq * 1.3 + phase * 0.7) * amp * 0.5;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M' + pts.join(' L');
};

const THIRD = (Math.PI * 2) / 3;

const VARIANTS = {
  // Hair-thin section divider — the shader's razor highlight lines.
  divider: {
    viewBox: '0 0 1200 90',
    lines: [
      { d: { yOffset: 22, amp: 8, slope: 0.016, freq: 3.0, phase: 5.1 }, stroke: PALETTE.c1, width: 1.2, opacity: 0.42, dur: 13 },
      { d: { yOffset: 38, amp: 9, slope: 0.018, freq: 2.2, phase: 0.4 }, stroke: PALETTE.c4, width: 1.4, opacity: 0.5, dur: 11 },
      { d: { yOffset: 54, amp: 11, slope: 0.02, freq: 1.8, phase: 1.6 }, stroke: PALETTE.c6, width: 1.1, opacity: 0.35, dur: 14 },
      { d: { yOffset: 68, amp: 8, slope: 0.022, freq: 2.6, phase: 2.9 }, stroke: PALETTE.c9, width: 0.9, opacity: 0.28, dur: 17 }
    ]
  },
  // Footer cluster — slightly denser, sits above the closing statement.
  footer: {
    viewBox: '0 0 1200 70',
    lines: [
      { d: { yOffset: 12, amp: 6, slope: 0.012, freq: 2.7, phase: 5.5 }, stroke: PALETTE.c4, width: 1.2, opacity: 0.36, dur: 14 },
      { d: { yOffset: 24, amp: 7, slope: 0.014, freq: 2.4, phase: 0.9 }, stroke: PALETTE.c1, width: 1.3, opacity: 0.4, dur: 12 },
      { d: { yOffset: 36, amp: 9, slope: 0.016, freq: 2.0, phase: 2.1 }, stroke: PALETTE.c5, width: 1.1, opacity: 0.34, dur: 15 },
      { d: { yOffset: 48, amp: 8, slope: 0.018, freq: 2.8, phase: 3.4 }, stroke: PALETTE.c8, width: 0.9, opacity: 0.26, dur: 18 },
      { d: { yOffset: 60, amp: 6, slope: 0.02, freq: 3.2, phase: 4.6 }, stroke: PALETTE.c10, width: 0.8, opacity: 0.2, dur: 21 }
    ]
  },
  // Narrow ribbon strip for ProjectDetail headers.
  strip: {
    viewBox: '0 0 1200 54',
    lines: [
      { d: { yOffset: 10, amp: 5, slope: 0.01, freq: 3.2, phase: 4.4 }, stroke: PALETTE.c4, width: 1.8, opacity: 0.45, dur: 12 },
      { d: { yOffset: 21, amp: 6, slope: 0.012, freq: 2.6, phase: 0.6 }, stroke: PALETTE.c1, width: 2.2, opacity: 0.55, dur: 10 },
      { d: { yOffset: 33, amp: 7, slope: 0.014, freq: 2.1, phase: 1.9 }, stroke: PALETTE.c5, width: 1.6, opacity: 0.4, dur: 13 },
      { d: { yOffset: 44, amp: 6, slope: 0.016, freq: 3.0, phase: 3.1 }, stroke: PALETTE.c9, width: 1.2, opacity: 0.3, dur: 16 }
    ]
  },
  // Large mirrored ribbons behind the Contact heading — the hero's bookend.
  backdrop: {
    viewBox: '0 0 1200 800',
    preserve: 'none',
    lines: [
      { d: { yOffset: 660, amp: 46, slope: -0.42, freq: 1.5, phase: 0.3 }, stroke: PALETTE.c1, width: 90, opacity: 0.05, dur: 22 },
      { d: { yOffset: 540, amp: 42, slope: -0.4, freq: 1.7, phase: 1.4 }, stroke: PALETTE.c4, width: 74, opacity: 0.05, dur: 26 },
      { d: { yOffset: 430, amp: 38, slope: -0.38, freq: 1.9, phase: 2.6 }, stroke: PALETTE.c6, width: 60, opacity: 0.045, dur: 30 },
      { d: { yOffset: 330, amp: 34, slope: -0.36, freq: 2.1, phase: 3.8 }, stroke: PALETTE.c9, width: 48, opacity: 0.04, dur: 34 },
      { d: { yOffset: 640, amp: 40, slope: -0.41, freq: 1.6, phase: 0.9 }, stroke: PALETTE.c5, width: 2, opacity: 0.22, dur: 24 },
      { d: { yOffset: 470, amp: 36, slope: -0.39, freq: 2.0, phase: 2.2 }, stroke: PALETTE.c8, width: 1.5, opacity: 0.18, dur: 28 }
    ]
  }
};

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WaveLines = ({ variant = 'divider', className = '' }) => {
  const cfg = VARIANTS[variant] || VARIANTS.divider;
  const width = 1200;

  return (
    <svg
      className={`wave-lines wave-lines--${variant} ${className}`.trim()}
      viewBox={cfg.viewBox}
      preserveAspectRatio={cfg.preserve || 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
    >
      {cfg.lines.map((line, i) => {
        const d0 = buildPath(width, line.d);
        const d1 = buildPath(width, { ...line.d, phase: line.d.phase + THIRD });
        const d2 = buildPath(width, { ...line.d, phase: line.d.phase + THIRD * 2 });
        return (
          <path
            key={i}
            d={d0}
            fill="none"
            stroke={line.stroke}
            strokeWidth={line.width}
            strokeLinecap="round"
            opacity={line.opacity}
          >
            {!REDUCED_MOTION && (
              <animate
                attributeName="d"
                values={`${d0};${d1};${d2};${d0}`}
                dur={`${line.dur}s`}
                repeatCount="indefinite"
                calcMode="linear"
              />
            )}
          </path>
        );
      })}
    </svg>
  );
};

export default WaveLines;
