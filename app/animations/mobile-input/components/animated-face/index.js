import { forwardRef, useCallback, useImperativeHandle } from "react";
import { useWindowDimensions } from "react-native";

import {
  Group,
  Path,
  Skia,
  Circle as SkiaCircle,
  interpolate,
} from "@shopify/react-native-skia";

import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const sadMouth = Skia.Path.MakeFromSVGString(
  "M31.2226 8.20008C27.3898 4.95606 22.4321 3 17.0176 3C11.6909 3 6.8063 4.89309 3 8.04317"
);

const happyMouth = Skia.Path.MakeFromSVGString(
  "M31.2226 2.99999C27.3898 6.24401 22.4321 8.20007 17.0176 8.20007C11.6909 8.20007 6.8063 6.30699 3 3.15691"
);

const runTimingConfig = {
  dampingRatio: 1,
  duration: 400,
};

const AnimatedFace = forwardRef((_, ref) => {
  const mouthProgress = useSharedValue(0.5);
  const eyesProgress = useSharedValue(0);

  const { width, height } = useWindowDimensions();

  const size = {
    current: {
      width: width * 2,
      height: height * 0.9,
    },
  };

  const happy = useCallback(() => {
    mouthProgress.value = withSpring(1, runTimingConfig);
  }, []);

  const sad = useCallback(() => {
    mouthProgress.value = withSpring(0, runTimingConfig);
  }, []);

  const closeEyes = useCallback(() => {
    eyesProgress.value = withSpring(0, runTimingConfig);
  }, []);

  const openEyes = useCallback(() => {
    eyesProgress.value = withSpring(1, runTimingConfig);
  }, []);

  const reset = useCallback(() => {
    mouthProgress.value = withSpring(0.5, runTimingConfig);
    closeEyes();
  }, [closeEyes]);

  useImperativeHandle(ref, () => ({
    happy,
    sad,
    reset,
    openEyes,
    closeEyes,
  }));

  const eyeRadius = useDerivedValue(() => {
    return interpolate(eyesProgress.value, [0, 1], [4, 6]);
  });

  const path = useDerivedValue(() => {
    return happyMouth.interpolate(sadMouth, mouthProgress.value);
  });

  const centerX = useDerivedValue(() => {
    return size.current.width / 4 - path.value.getBounds().width / 2;
  });

  const centerY = useDerivedValue(() => {
    return size.current.height / 4 + 30;
  });

  const origin = useDerivedValue(() => {
    return {
      x: centerX.value + path.value.getBounds().width / 2 + eyeRadius.value,
      y: centerY.value - 5,
    };
  });

  const transform = useDerivedValue(() => {
    return [
      { scale: 1.8 },
      { translateX: centerX.value },
      { translateY: centerY.value },
    ];
  });

  const firstEyeCx = useDerivedValue(() => {
    return eyeRadius.value / 2;
  });

  const secondEyeCx = useDerivedValue(() => {
    return path.value.getBounds().width + eyeRadius.value / 2;
  });

  return (
    <Group origin={origin} transform={transform}>
      <Group>
        <SkiaCircle cx={firstEyeCx} cy={-20} r={eyeRadius} color="white" />
        <SkiaCircle cx={secondEyeCx} cy={-20} r={eyeRadius} color="white" />
        <Path
          path={path}
          color="white"
          style="stroke"
          strokeWidth={3}
          strokeCap="round"
          strokeJoin="round"
        />
      </Group>
    </Group>
  );
});

export { AnimatedFace };