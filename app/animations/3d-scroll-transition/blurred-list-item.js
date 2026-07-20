import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  Blur,
  BlurMask,
  Canvas,
  Fill,
  Group,
  Mask,
  Paint,
  SweepGradient,
  Text,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

const ManropeRegular = require("../../../assets/fonts/ManropeRegular.otf");

export const BlurredListItem = ({ text, size, index, scrollY }) => {
  const inputRange = useMemo(
    () => [
      size * (index - 1),
      size * (index - 1) + 20,
      size * index,
      size * (index + 1) - 20,
      size * (index + 1),
    ],
    [index, size]
  );

  const blur = useDerivedValue(() => {
    const outputRange = [0, 6, 0, 6, 0];
    return interpolate(
      scrollY.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP
    );
  }, [inputRange, scrollY]);

  const opacity = useDerivedValue(() => {
    const outputRange = [0, 0.5, 1, 0.5, 0];
    return interpolate(
      scrollY.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP
    );
  }, [inputRange, scrollY]);

  const rItemStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(scrollY.value, inputRange, [
      -Math.PI / 2,
      -Math.PI / 2,
      0,
      -Math.PI / 2,
      -Math.PI / 2,
    ]);

    return {
      opacity: opacity.value,
      transform: [
        {
          perspective: 200,
        },
        {
          rotateX: `${rotateX}rad`,
        },
      ],
    };
  }, [inputRange, scrollY]);

  const { width: windowWidth } = useWindowDimensions();
  const font = useFont(ManropeRegular, 175);

  const sweepGradient = useMemo(() => {
    return (
      <SweepGradient
        c={vec(windowWidth / 2, size / 2)}
        colors={["cyan", "magenta", "yellow", "cyan"]}
      />
    );
  }, [size, windowWidth]);

  if (!font) {
    return null;
  }

  return (
    <Animated.View style={rItemStyle}>
      <Canvas
        style={{
          width: windowWidth,
          height: size,
        }}
      >
        <Group
          layer={
            <Paint>
              <Blur blur={blur} />
            </Paint>
          }
        >
          <Mask
            mask={
              <Text
                color={"white"}
                font={font}
                text={text}
                x={windowWidth / 2 - font.measureText(text).width / 2}
                y={size / 2 + font.getSize() / 4}
              />
            }
          >
            <Fill>{sweepGradient}</Fill>
          </Mask>
          <BlurMask blur={4} style={"solid"} />
        </Group>
      </Canvas>
    </Animated.View>
  );
}
