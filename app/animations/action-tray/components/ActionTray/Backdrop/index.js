import { StyleSheet } from "react-native";
import { memo } from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(Animated.View);

function Backdrop({ isActive, onTap }) {
  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive.value ? 1 : 0),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: isActive.value ? "auto" : "none",
    };
  });

  return (
    <AnimatedView
      onTouchStart={onTap}
      animatedProps={rBackdropProps}
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: "rgba(0,0,0,0.2)" },
        rBackdropStyle,
      ]}
    />
  );
}

export default memo(Backdrop);
