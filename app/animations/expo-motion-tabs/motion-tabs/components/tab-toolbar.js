import React, { memo } from "react";
import { View } from "react-native";
import { layoutStyles as styles } from "../utils/layout-styles";
import { MorphTab } from "./morph-tab";

export default memo(function TabToolbar({
  colors,
  items,
  onLayout,
  onPress,
  view
}) {
  return (
    <View style={styles.toolbarRow} onLayout={onLayout}>
      {items.map((item, index) => (
        <MorphTab
          key={item.key}
          active={view === item.key}
          colors={colors}
          item={item}
          onPress={() => onPress(item, index)}
        />
      ))}
    </View>
  );
});
