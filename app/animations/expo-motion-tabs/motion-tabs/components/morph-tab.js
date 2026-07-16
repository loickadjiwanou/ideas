import React, { memo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useMorphTabMotion } from "../hooks/use-morph-tab-motion";
import { tabStyles as styles } from "../utils/tab-styles";

export default memo(function MorphTab({
  active,
  colors,
  item,
  onPress,
}) {
  const [labelW, setLabelW] = useState(0);
  const motion = useMorphTabMotion(active, colors, labelW);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={motion.hold}
      onPressOut={motion.release}
    >
      <Text
        numberOfLines={1}
        onLayout={(event) => {
          const width = Math.ceil(event.nativeEvent.layout.width);
          if (width > 0 && width !== labelW) setLabelW(width);
        }}
        style={[styles.tabLabel, styles.measureLabel]}
      >
        {item.label}
      </Text>

      <Animated.View style={[styles.tabMorph, motion.containerStyle]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.holdCircle,
            { backgroundColor: colors.accent },
            motion.holdCircleStyle,
          ]}
        />
        <View style={styles.iconBox}>
          <Animated.View
            style={[styles.iconLayer, motion.iconInactiveStyle, motion.iconSqueezeStyle]}
          >
            {item.icon(false, colors.muted, 22)}
          </Animated.View>
          <Animated.View
            style={[styles.iconLayer, motion.iconActiveStyle, motion.iconSqueezeStyle]}
          >
            {item.icon(true, colors.foreground, 22)}
          </Animated.View>
        </View>
        <Animated.View style={[styles.tabLabelWrap, motion.labelStyle]}>
          <Text
            ellipsizeMode="clip"
            numberOfLines={1}
            style={[
              styles.tabLabel,
              styles.fixedLabel,
              { color: colors.foreground, width: labelW },
            ]}
          >
            {item.label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
});
