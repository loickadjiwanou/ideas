import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useCallback } from 'react';
import { SHAPE_COUNT } from '../../constants/blob-morphing';

// Full cycle: 3 s per shape transition
const CYCLE_DURATION = SHAPE_COUNT * 3000;

export const useMorphAnimation = () => {
  const morphTime = useSharedValue(0);

  const start = useCallback(() => {
    morphTime.value = 0;
    morphTime.value = withRepeat(
      withTiming(SHAPE_COUNT, {
        duration: CYCLE_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [morphTime]);

  return { morphTime, start };
};
