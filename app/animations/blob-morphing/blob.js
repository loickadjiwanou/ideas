import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import {
  CANVAS_SIZE,
  CX,
  CY,
  BLOB_SHAPES,
  SHAPE_COUNT,
  NUM_POINTS,
} from '../../../constants/blob-morphing';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const TENSION = 0.38; // Catmull-Rom → cubic Bézier scale factor

// ---------------------------------------------------------------------------
// Worklet helpers
// ---------------------------------------------------------------------------

function computeRadii(t) {
  'worklet';
  const idx = Math.floor(t % SHAPE_COUNT);
  const nextIdx = (idx + 1) % SHAPE_COUNT;
  const localT = t - Math.floor(t);
  // ease in-out sine so each transition feels smooth
  const easedT = -(Math.cos(Math.PI * localT) - 1) / 2;

  const a = BLOB_SHAPES[idx];
  const b = BLOB_SHAPES[nextIdx];
  const radii = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    radii.push(a[i] + (b[i] - a[i]) * easedT);
  }
  return radii;
}

function buildD(radii, scale) {
  'worklet';
  const n = NUM_POINTS;
  const xs = [];
  const ys = [];

  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    xs.push(CX + radii[i] * scale * Math.cos(angle));
    ys.push(CY + radii[i] * scale * Math.sin(angle));
  }

  let d = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;

  for (let i = 0; i < n; i++) {
    const i0 = (i - 1 + n) % n;
    const i2 = (i + 1) % n;
    const i3 = (i + 2) % n;

    // Catmull-Rom tangent → cubic Bézier control points
    const cp1x = xs[i] + (xs[i2] - xs[i0]) * TENSION;
    const cp1y = ys[i] + (ys[i2] - ys[i0]) * TENSION;
    const cp2x = xs[i2] - (xs[i3] - xs[i]) * TENSION;
    const cp2y = ys[i2] - (ys[i3] - ys[i]) * TENSION;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${xs[i2].toFixed(1)} ${ys[i2].toFixed(1)}`;
  }

  d += ' Z';
  return d;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Blob({ morphTime, colors }) {
  // Outer ambient ring (largest, most transparent)
  const outerGlowProps = useAnimatedProps(() => {
    const radii = computeRadii(morphTime.value);
    return { d: buildD(radii, 1.28) };
  });

  // Mid soft halo
  const innerGlowProps = useAnimatedProps(() => {
    const radii = computeRadii(morphTime.value);
    return { d: buildD(radii, 1.1) };
  });

  // Main blob
  const blobProps = useAnimatedProps(() => {
    const radii = computeRadii(morphTime.value);
    return { d: buildD(radii, 1) };
  });

  return (
    <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
      <Defs>
        {/* Main diagonal gradient */}
        <LinearGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="50%" stopColor={colors[1]} />
          <Stop offset="100%" stopColor={colors[2]} />
        </LinearGradient>
        {/* Outer glow gradient (radial-ish via diagonal + opacity) */}
        <LinearGradient id="outerGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={colors[1]} stopOpacity="0.06" />
        </LinearGradient>
        {/* Inner halo */}
        <LinearGradient id="innerHalo" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={colors[0]} stopOpacity="0.28" />
          <Stop offset="100%" stopColor={colors[2]} stopOpacity="0.1" />
        </LinearGradient>
      </Defs>

      {/* Layer 1 – outer ambient glow */}
      <AnimatedPath animatedProps={outerGlowProps} fill="url(#outerGlow)" />

      {/* Layer 2 – inner halo */}
      <AnimatedPath animatedProps={innerGlowProps} fill="url(#innerHalo)" />

      {/* Layer 3 – main crisp gradient blob */}
      <AnimatedPath animatedProps={blobProps} fill="url(#blobGrad)" />
    </Svg>
  );
}
