import { StyleSheet, View } from "react-native";
import { forwardRef, useImperativeHandle, useState } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import StaggeredDigit from "./staggered-digit";

const StaggeredText = forwardRef(
  (
    {
      text,
      delay = 0,
      fontSize = 50,
      textStyle,
      containerStyle,
      enableReverse = false,
    },
    ref
  ) => {
    const progress = useSharedValue(0);
    const [direction, setDirection] = useState(1);

    useImperativeHandle(ref, () => ({
      animate: (dir = 1) => {
        setDirection(dir);
        setTimeout(() => {
          progress.value = 1;
        }, 0);
      },
      reset: () => {
        progress.value = 0;
      },
      toggleAnimate: () => {
        if (!enableReverse) {
          console.warn(
            "You must add the prop 'enableReverse' to StaggeredText to support the toggleAnimate method."
          );
          return;
        }
        progress.value = progress.value === 0 ? 1 : 0;
      },
    }));

    return (
      <View style={[styles.container, containerStyle]}>
        {text.split("").map((char, index) => {
          const delayedProgress = useDerivedValue(() => {
            "worklet";
            if (progress.value === 0 && !enableReverse) {
              return 0;
            }
            const delayMs = index * 40 + delay;
            return withDelay(
              delayMs,
              withSpring(progress.value, {
                duration: 350,
                dampingRatio: 2.8,
              })
            );
          }, []);

          return (
            <StaggeredDigit
              key={index}
              digit={char}
              progress={delayedProgress}
              fontSize={fontSize}
              textStyle={textStyle}
              direction={direction}
            />
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default StaggeredText;
