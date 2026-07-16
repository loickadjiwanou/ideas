import { BlurView } from "expo-blur";
import React, { memo, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View, useColorScheme } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MeasurementLayer } from "./components/measurement-layer";
import { PanelStack } from "./components/panel-stack";
import { TabToolbar } from "./components/tab-toolbar";
import { useCardMorph } from "./hooks/use-card-morph";
import { useDynamicLayout } from "./hooks/use-dynamic-layout";
import { useNavItems } from "./hooks/use-nav-items";
import { usePopupRenderer } from "./hooks/use-popup-renderer";
import { useViewTransition } from "./hooks/use-view-transition";
import { layoutStyles as styles } from "./utils/layout-styles";
import { palette } from "./utils/palette";
import { estimateToolbarWidth } from "./utils/toolbar-width";

export default memo(function AnimatedTabBar({ props }) {
  const { descriptors, navigation, renderPopupBody, state } = props;
  const insets = useSafeAreaInsets();
  const scheme = (useColorScheme() ?? "light");
  const colors = useMemo(() => palette(scheme), [scheme]);
  const popupRenderer = usePopupRenderer(renderPopupBody);
  const items = useNavItems({ descriptors, state });
  const layout = useDynamicLayout();
  const transition = useViewTransition(items);
  const toolbarTargetW = Math.max(
    layout.toolbarW,
    estimateToolbarWidth(items, transition.view),
  );
  const motion = useCardMorph({
    sizes: layout.sizes,
    toolbarH: layout.toolbarH,
    toolbarMinW: layout.toolbarMinW,
    toolbarW: toolbarTargetW,
    view: transition.view,
  });

  const handlePress = (item, index) => {
    const isFocused = state.index === index;
    if (!isFocused) navigation.navigate(item.routeName);
    transition.setNextView(item);
  };

  const borderColor = scheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const surfaceColor =
    scheme === "dark" ? "rgba(24,24,27,0.85)" : "rgba(245,245,247,0.85)";

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.root]}
    >
      <MeasurementLayer
        colors={colors}
        items={items}
        onMeasure={layout.handleMeasure}
        renderPopupBody={popupRenderer}
      />
      {transition.view !== "default" && (
        <Pressable
          accessibilityLabel="Close menu"
          accessibilityRole="button"
          onPress={transition.close}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        pointerEvents="box-none"
        style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <Animated.View style={[styles.cardShadow, motion.cardStyle]}>
          <BlurView
            intensity={Platform.OS === "ios" ? 60 : 80}
            tint={scheme === "dark" ? "dark" : "light"}
            style={[
              styles.card,
              {
                borderColor,
                ...(Platform.OS === "android" && {
                  backgroundColor: surfaceColor,
                }),
              },
            ]}
          >
            <PanelStack
              colors={colors}
              direction={transition.panelDirection}
              items={items}
              onMeasure={layout.handleMeasure}
              renderPopupBody={popupRenderer}
              view={transition.view}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.divider,
                motion.dividerStyle,
                { backgroundColor: colors.border },
              ]}
            />
            <TabToolbar
              colors={colors}
              items={items}
              onLayout={layout.handleToolbarLayout}
              onPress={handlePress}
              view={transition.view}
            />
          </BlurView>
        </Animated.View>
      </View>
    </View>
  );
});