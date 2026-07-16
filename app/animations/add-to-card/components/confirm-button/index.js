import { useWindowDimensions } from "react-native";
import { memo } from "react";
import { PressableScale } from "pressto";
import {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

const ConfirmButton = memo(
  ({ animationProgress, layoutData, style, children, onConfirm }) => {
    const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
      useWindowDimensions();

    const animatedTop = useDerivedValue(() => {
      if (!layoutData.value) return 0;
      return interpolate(
        animationProgress.value,
        [0, 1],
        [layoutData.value.pageY, SCREEN_HEIGHT - 100]
      );
    }, [SCREEN_HEIGHT]);

    const animatedWidth = useDerivedValue(() => {
      if (!layoutData.value) return 0;
      return interpolate(
        animationProgress.value,
        [0, 1],
        [layoutData.value.width, SCREEN_WIDTH * 0.9]
      );
    }, [SCREEN_WIDTH]);

    const animatedHeight = useDerivedValue(() => {
      if (!layoutData.value) return 0;
      return interpolate(
        animationProgress.value,
        [0, 1],
        [layoutData.value.height, 45]
      );
    }, []);

    const animatedLeft = useDerivedValue(() => {
      if (!layoutData.value) return 0;
      return interpolate(
        animationProgress.value,
        [0, 1],
        [layoutData.value.pageX, SCREEN_WIDTH * 0.05]
      );
    }, [SCREEN_WIDTH]);

    const rStyle = useAnimatedStyle(() => {
      if (!layoutData.value) {
        return {
          height: 0,
          width: 0,
          opacity: 0,
        };
      }
      return {
        height: animatedHeight.value,
        width: animatedWidth.value,
        zIndex: 10,
        top: animatedTop.value,
        left: animatedLeft.value,
        opacity: 1,
      };
    }, []);

    return (
      <PressableScale
        onPress={onConfirm}
        style={[
          style,
          {
            position: "absolute",
          },
          rStyle,
        ]}
      >
        {children}
      </PressableScale>
    );
  }
);

export default ConfirmButton;
