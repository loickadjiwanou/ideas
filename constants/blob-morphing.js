// Each shape: 8 radii at evenly spaced angles, starting from the top (−π/2), clockwise.
// Values in pixels for a 300×300 canvas centred at (150, 150).
export const CANVAS_SIZE = 300;
export const CX = CANVAS_SIZE / 2;
export const CY = CANVAS_SIZE / 2;
export const NUM_POINTS = 8;
export const SHAPE_COUNT = 5;

export const BLOB_SHAPES = [
  // 0 – calm, nearly circular
  [120, 108, 124, 112, 118, 110, 122, 106],
  // 1 – lively, asymmetric
  [136, 94, 118, 142, 100, 130, 112, 88],
  // 2 – wide, organic
  [100, 138, 130, 88, 142, 102, 106, 140],
  // 3 – tall
  [112, 126, 94, 136, 118, 100, 140, 106],
  // 4 – dynamic
  [140, 100, 126, 106, 90, 138, 116, 94],
];

// [color-stop-0, color-stop-1, color-stop-2]
export const COLOR_THEMES = [
  ['#7C3AED', '#3B82F6', '#06B6D4'], // Aurora
  ['#F59E0B', '#EF4444', '#EC4899'], // Sunset
  ['#10B981', '#14B8A6', '#6366F1'], // Ocean
  ['#F43F5E', '#A855F7', '#3B82F6'], // Rose
];
