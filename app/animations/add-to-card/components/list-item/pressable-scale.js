import { memo } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const PressableScale = memo(({ children, onPress, style, ...props }) => {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onTouchesDown(() => {
      scale.value = withSpring(0.9, { overshootClamping: true });
    })
    .onTouchesUp(() => {
      onPress();
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { overshootClamping: true });
    });

  tapGesture.maxDuration(5000);
  tapGesture.shouldCancelWhenOutside(true);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View {...props} style={[style, rStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
});

export default PressableScale;
