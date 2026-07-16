import { useEffect } from "react";
import {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { DURATION, EASING, ICON_BOX, LABEL_PAD } from "../utils/constants";

export default function useMorphTabMotion(active, colors, labelW) {
  const progress = useSharedValue(active ? 1 : 0);
  const held = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: DURATION,
      easing: EASING,
    });
  }, [active, progress]);

  const containerStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      width: ICON_BOX + p * (labelW + LABEL_PAD),
      backgroundColor: interpolateColor(p, [0, 1], ["rgba(0,0,0,0)", colors.accent]),
    };
  });

  const holdCircleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(held.value, [0, 1], [0, active ? 0.35 : 1]),
    transform: [{ scale: interpolate(held.value, [0, 1], [0.68, 1]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    width: progress.value * (labelW + LABEL_PAD),
    opacity: interpolate(progress.value, [0, 0.3, 1], [0, 0, 1]),
    transform: [{ translateX: -8 * (1 - progress.value) }],
  }));

  const iconActiveStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const iconInactiveStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const iconSqueezeStyle = useAnimatedStyle(() => {
    const p = held.value;
    return {
      transform: [
        { translateY: withSpring(interpolate(p, [0, 1], [0, 1.5])) },
        { scaleX: withSpring(interpolate(p, [0, 1], [1, 1.08])) },
        { scaleY: withSpring(interpolate(p, [0, 1], [1, 0.76], Extrapolation.CLAMP)) },
      ],
    };
  });

  const hold = () => {
    held.value = withTiming(1, { duration: 140, easing: EASING });
  };

  const release = () => {
    held.value = withTiming(0, { duration: 220, easing: EASING });
  };

  return {
    containerStyle,
    hold,
    holdCircleStyle,
    iconActiveStyle,
    iconInactiveStyle,
    iconSqueezeStyle,
    labelStyle,
    release,
  };
}
