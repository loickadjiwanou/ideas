import { Easing } from "react-native-reanimated";

export const HOME_ITEMS = [
  { icon: "note", text: "Note" },
  { icon: "voice", text: "Voice" },
  { icon: "screenshot", text: "Screenshot" },
];

export const SEARCH_OPTIONS = [
  { icon: "filter", text: "Filter" },
  { icon: "trending", text: "Trending" },
];

export const NOTIFICATION_ITEMS = [
  { icon: "messages", text: "Messages" },
  { icon: "alerts", text: "System Alerts" },
];

export const EASING = Easing.bezier(0.22, 1, 0.36, 1);
export const DURATION = 600;
export const ICON_BOX = 48;
export const LABEL_PAD = 18;
export const PANEL_SLIDE = 65;
export const TAB_HEIGHT = 44;
