import { useState } from "react";
import { viewIndex } from "../utils/view-index";

export default function useViewTransition(items) {
  const [view, setView] = useState("default");
  const [panelDirection, setPanelDirection] = useState(0);

  const setNextView = (item) => {
    const nextView = view === item.key ? "default" : item.key;
    const nextDirection =
      view !== "default" && nextView !== "default"
        ? Math.sign(viewIndex(items, nextView) - viewIndex(items, view))
        : 0;

    setPanelDirection(nextDirection);
    setView(nextView);
  };

  const close = () => {
    setPanelDirection(0);
    setView("default");
  };

  return { close, panelDirection, setNextView, view };
}
