export default function viewIndex(items, view) {
  return items.findIndex((item) => item.key === view);
}
