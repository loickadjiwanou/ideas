import React, { memo } from "react";
import { View } from "react-native";
import { layoutStyles as styles } from "../utils/layout-styles";
import { PanelLayer } from "./panel-layer";

export default memo(function PanelStack({
  colors,
  direction,
  items,
  onMeasure,
  renderPopupBody,
  view
}) {

  return (
    <View style={styles.panelArea}>
      {items.map((item) => (
        <PanelLayer
          key={item.key}
          active={view === item.key}
          colors={colors}
          direction={direction}
          onLayout={onMeasure}
          renderPopupBody={renderPopupBody}
          route={item.route}
          view={item.key}
        />
      ))}
    </View>
  );
});
