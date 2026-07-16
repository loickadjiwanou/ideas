import React, { memo } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { usePanelMotion } from "../hooks/use-panel-motion";
import { layoutStyles as styles } from "../utils/layout-styles";

export default memo(function PanelLayer({
  active,
  colors,
  direction,
  onLayout,
  renderPopupBody,
  route,
  view
}) {
  const motion = usePanelMotion(active, direction);
  const PopupBody = renderPopupBody;

  return (
    <Animated.View
      pointerEvents={active ? "auto" : "none"}
      style={[styles.panelLayer, motion.style]}
    >
      <Animated.View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          onLayout(view, Math.ceil(width), Math.ceil(height));
        }}
        style={Platform.OS === "android" ? motion.androidBlurStyle : undefined}
      >
        <PopupBody colors={colors} route={route} view={view} />
      </Animated.View>
      {Platform.OS === "ios" && (
        <motion.AnimatedBlurView
          animatedProps={motion.blurProps}
          pointerEvents="none"
          tint="systemUltraThinMaterialDark"
          style={StyleSheet.absoluteFill}
        />
      )}
    </Animated.View>
  );
});
