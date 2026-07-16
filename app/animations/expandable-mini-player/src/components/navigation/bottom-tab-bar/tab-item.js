import { StyleSheet } from 'react-native';

import { createAnimatedPressable } from 'pressto';
import { interpolate } from 'react-native-reanimated';

import * as Icons from '../../icons';
import { Palette } from '../../../constants/palette';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const PressableScaleWithOpacity = createAnimatedPressable(
  (progress, { isSelected }) => {
    'worklet';

    return {
      opacity: interpolate(progress, [0, 1], [isSelected ? 1 : 0.5, 1]),
      transform: [
        {
          scale: interpolate(progress, [0, 1], [1, 0.97]),
        },
      ],
    };
  },
);

export const TabItem = ({ icon, onPress }) => {
  const capitalizedIcon = capitalize(icon);
  const Icon = Icons[capitalizedIcon];

  return (
    <PressableScaleWithOpacity onPress={onPress} style={styles.fillCenter}>
      <Icon color={Palette.icons} />
    </PressableScaleWithOpacity>
  );
};

const styles = StyleSheet.create({
  fillCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});