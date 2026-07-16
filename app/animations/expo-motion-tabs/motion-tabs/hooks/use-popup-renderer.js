import React, { useMemo } from "react";
import { PopupBody } from "../components/popup-body";

export default function usePopupRenderer(renderPopupBody) {
  return useMemo(
    () =>
      renderPopupBody ??
      ((context) => (
        <PopupBody colors={context.colors} route={context.route} view={context.view} />
      )),
    [renderPopupBody],
  );
}
