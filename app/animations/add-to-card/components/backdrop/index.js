import { StyleSheet } from "react-native";
import { memo } from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

export const Backdrop = memo(({ animationProgress, onPress }) => {
  const isActive = useDerivedValue(() => {
    return animationProgress.value > 0;
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      pointerEvents: isActive.value ? "auto" : "none",
    };
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
    };
  }, []);

  return (
    <Animated.View
      onTouchEnd={onPress}
      animatedProps={animatedProps}
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(0,0,0,0.75)",
        },
        rStyle,
      ]}
    />
  );
});
