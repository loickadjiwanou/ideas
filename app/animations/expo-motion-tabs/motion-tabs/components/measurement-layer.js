import React, { memo } from "react";
import { View } from "react-native";
import { layoutStyles as styles } from "../utils/layout-styles";

export default function MeasurementLayer({ colors, items, onMeasure, renderPopupBody }) {
  const PopupBody = renderPopupBody;

  return (
    <View pointerEvents="none" style={styles.measure}>
      {items.map((item) => (
        <View
          key={item.key}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            onMeasure(item.key, Math.ceil(width), Math.ceil(height));
          }}
        >
          <PopupBody colors={colors} route={item.route} view={item.key} />
        </View>
      ))}
    </View>
  );
};
