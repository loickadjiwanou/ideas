import { StyleSheet } from 'react-native';

import { useCallback } from 'react';

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  FlipInXDown,
  FlipOutXDown,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export const AnimatedCodeNumber = ({
  code,
  highlighted,
  status,
}) => {
  const getColorByStatus = useCallback(
    (vStatus) => {
      'worklet';

      // Si le chiffre est surligné, on l'affiche en violet
      if (highlighted) return '#5807a8';

      // Sinon, bleu si correct, rouge si incorrect
      if (vStatus === 'correct') {
        return '#3171f2';
      }

      if (vStatus === 'wrong') {
        return '#d62e2e';
      }

      // Sinon transparent
      return 'transparent';
    },
    [highlighted]
  );

  const rBoxStyle = useAnimatedStyle(() => {
    const isActive =
      status.value === 'inProgress' ||
      status.value === 'correct' ||
      status.value === 'wrong';

    return {
      borderWidth: withTiming(isActive ? 2.1 : 0),
      borderColor: withTiming(getColorByStatus(status.value)),
    };
  }, [getColorByStatus]);

  return (
    <Animated.View style={[styles.container, rBoxStyle]}>
      {code != null && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
        >
          <Animated.Text
            entering={FlipInXDown.duration(500)
              .easing(Easing.bezier(0, 0.75, 0.5, 0.9).factory())
              .build()}
            exiting={FlipOutXDown.duration(500)
              .easing(Easing.bezier(0.6, 0.1, 0.4, 0.8).factory())
              .build()}
            style={styles.text}
          >
            {code}
          </Animated.Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderCurve: 'continuous',
    borderRadius: 25,
    borderWidth: 2,
    boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.05)',
    height: '90%',
    justifyContent: 'center',
    width: '80%',
  },
  text: {
    color: 'black',
    fontFamily: 'FiraCode-Regular',
    fontSize: 40,
  },
});