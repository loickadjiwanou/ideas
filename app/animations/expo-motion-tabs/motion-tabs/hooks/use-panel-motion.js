import { BlurView } from "expo-blur";
import { useEffect } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { DURATION, EASING, PANEL_SLIDE } from "../utils/constants";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function usePanelMotion(active, direction) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: DURATION - 80,
      easing: EASING,
    });
  }, [active, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const travel = direction === 0 ? 0 : direction * PANEL_SLIDE;
    const translateX = active ? travel * (1 - p) : -travel * (1 - p);
    return {
      opacity: p,
      transform: [{ translateX }, { scale: withSpring(0.97 + 0.03 * p) }],
    };
  }, [active, direction]);

  const blurProps = useAnimatedProps(() => ({
    intensity: withSpring(
      interpolate(progress.value, [0, 0.5, 1], [0, 15, 0], Extrapolation.CLAMP),
    ),
  }));

  const androidBlurStyle = useAnimatedStyle(() => ({
    filter: [
      {
        blur: withSpring(
          interpolate(progress.value, [0, 0.5, 1], [0, 10, 0], Extrapolation.CLAMP),
        ),
      },
    ],
  }));

  return { AnimatedBlurView, androidBlurStyle, blurProps, style };
}
