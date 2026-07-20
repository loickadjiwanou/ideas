import React from "react";
import { PressableScale } from "pressto";
import {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedOpacityView = ({
  index,
  activeIndex,
  style,
  onPress,
  ...viewProps
}) => {
  const rStyle = useAnimatedStyle(() => {
    const opacity = withTiming(activeIndex.value === index ? 1 : 0.5);

    return {
      opacity,
    };
  }, [index]);

  return (
    <PressableScale
      onPress={onPress}
      style={[style, rStyle]}
      {...viewProps}
    />
  );
};

export default AnimatedOpacityView;