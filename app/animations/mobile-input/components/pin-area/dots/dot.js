import { memo } from "react";

import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const Dot = memo(({ index, activeDots }) => {
  const rStyle = useAnimatedStyle(() => {
    const isActive = activeDots.value > index;
    const opacity = withTiming(isActive ? 1 : 0.4);
    const scale = withSpring(isActive ? 1.4 : 1);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          aspectRatio: 1,
          marginHorizontal: 12,
          borderRadius: 4,
          backgroundColor: "white",
        },
        rStyle,
      ]}
    />
  );
});

export { Dot };