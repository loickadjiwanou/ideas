import { useState } from "react";

export default function useDynamicLayout() {
  const [sizes, setSizes] = useState({});
  const [toolbarMinW, setToolbarMinW] = useState(0);
  const [toolbarW, setToolbarW] = useState(0);
  const [toolbarH, setToolbarH] = useState(0);

  const handleMeasure = (view, w, h) => {
    if (w <= 0 || h <= 0) return;
    setSizes((current) => {
      const existing = current[view];
      if (existing?.w === w && existing.h === h) return current;
      return { ...current, [view]: { w, h } };
    });
  };

  const handleToolbarLayout = (event) => {
    const w = Math.ceil(event.nativeEvent.layout.width);
    const h = Math.ceil(event.nativeEvent.layout.height);
    if (toolbarMinW === 0 && w > 0) setToolbarMinW(w);
    if (w > 0 && w !== toolbarW) setToolbarW(w);
    if (h > 0 && h !== toolbarH) setToolbarH(h);
  };

  return {
    handleMeasure,
    handleToolbarLayout,
    sizes,
    toolbarH,
    toolbarMinW,
    toolbarW,
  };
}
