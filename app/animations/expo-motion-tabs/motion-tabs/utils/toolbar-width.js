import { ICON_BOX, LABEL_PAD } from "./constants";

function estimateLabelWidth(label) {
  return Math.ceil(label.length * 8.5 + 4);
}

export default function estimateToolbarWidth(items, activeKey) {
  const active = items.find((item) => item.key === activeKey);
  const labelW = active ? estimateLabelWidth(active.label) + LABEL_PAD : 0;
  const gaps = Math.max(items.length - 1, 0) * 2;
  return items.length * ICON_BOX + labelW + gaps + 12;
}
