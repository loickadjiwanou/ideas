import { useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { Canvas } from "@shopify/react-native-skia";
import Animated, {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { AnimatedFace } from "./components/animated-face";
import { ButtonsGrid } from "./components/buttons-grid";
import { CircleStroke } from "./components/circle-stroke";
import { PinArea } from "./components/pin-area";
import useAnimatedShake from "./hooks/use-animated-shake";

export default function LockScreen({
  correctPin,
  onClear,
  onCompleted,
  onError,
}) {
  const insets = useSafeAreaInsets();
  const animatedFaceRef = useRef(null);

  const { shake, rShakeStyle: rPinContainerStyle } = useAnimatedShake();

  const pin = useSharedValue([]);

  const activeDots = useDerivedValue(() => {
    return pin.value.length;
  });

  const correct = useCallback(() => {
    animatedFaceRef.current?.happy();
    onCompleted?.();
  }, [onCompleted]);

  const wrong = useCallback(() => {
    shake();
    onError?.(pin.value.join(""));
    animatedFaceRef.current?.sad();
  }, [onError, shake]);

  const activate = useCallback(() => {
    animatedFaceRef.current?.openEyes();
  }, []);

  const reset = useCallback(() => {
    pin.value = [];
    animatedFaceRef.current?.reset();
    onClear?.();
  }, [onClear]);

  useAnimatedReaction(
    () => pin.value,
    (currentPin) => {
      const active = currentPin.length > 0;

      if (currentPin.length > correctPin.length) {
        return;
      }

      if (currentPin.join("") === correctPin) {
        scheduleOnRN(correct);
        return;
      }

      if (currentPin.length === correctPin.length) {
        scheduleOnRN(wrong);
        return;
      }

      if (active) {
        scheduleOnRN(activate);
      }
    }
  );

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: "200%",
          position: "absolute",
          aspectRatio: 1,
        }}
      >
        <CircleStroke />
        <AnimatedFace ref={animatedFaceRef} />
      </Canvas>

      <View
        style={[
          styles.fill,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <View style={styles.fill} />

        <View style={{ height: "60%" }}>
          <Animated.View style={rPinContainerStyle}>
            <PinArea
              activeDots={activeDots}
              dotsAmount={correctPin.length}
              style={{
                marginTop: 20,
                marginBottom: 15,
              }}
            />
          </Animated.View>

          <ButtonsGrid pin={pin} onReset={reset} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C274D",
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
