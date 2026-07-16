import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const DefaultFontSize = 50;
const DefaultFontHeight = DefaultFontSize + 5;

const StaggeredDigit = ({
  digit,
  progress,
  fontSize = DefaultFontSize,
  fontHeight = DefaultFontHeight,
  textStyle,
  direction = 1,
}) => {
  const rStyle = useAnimatedStyle(() => {
    const rotateX = `${progress.value * 90 * direction}deg`;
    return {
      opacity: 1 - progress.value,
      transform: [
        {
          perspective: 1000,
        },
        {
          translateY: (-progress.value * fontHeight * direction) / 2,
        },
        {
          rotateX,
        },
      ],
    };
  });

  const rBottomDigitStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(progress.value, [0, 1], [-90 * direction, 0]);
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [(fontHeight * direction) / 2, 0]
    );
    return {
      opacity: progress.value,
      transform: [
        {
          translateY,
        },
        {
          rotateX: `${rotateX}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.Text
        style={[
          styles.digit,
          {
            fontSize,
          },
          rStyle,
          textStyle,
        ]}
      >
        {digit}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.digit,
          {
            position: "absolute",
            fontSize,
          },
          rBottomDigitStyle,
          textStyle,
        ]}
      >
        {digit}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  digit: {
    color: "white",
  },
});

export default StaggeredDigit;
