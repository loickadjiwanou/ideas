import { Ionicons } from "@expo/vector-icons";
import React from "react";

const ION_MAP = {
  home: "home",
  search: "search",
  bell: "notifications",
  note: "create-outline",
  voice: "mic",
  screenshot: "camera",
  filter: "filter",
  trending: "trending-up",
  messages: "chatbubble-ellipses",
  alerts: "alert-circle",
  library: "library",
  stats: "stats-chart",
  profile: "person-circle",
};

export default function TabIcon({ name, size = 22, color }) {
  return <Ionicons name={ION_MAP[name] ?? name} size={size} color={color} />;
}
