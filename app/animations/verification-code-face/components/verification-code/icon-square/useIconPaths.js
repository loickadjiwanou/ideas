import { useCallback } from 'react';

import { Skia, usePathInterpolation } from '@shopify/react-native-skia';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DefaultEyebrowPaths, DefaultMouthPaths } from './constants';

// Constantes représentant les différents états de l'animation
const AnimationType = {
  Happy: 0,
  Normal: 1,
  Sad: 2,
};

// Convertit les chemins SVG de la bouche en objets Skia Path
const outputRange = [
  DefaultMouthPaths.Happy,
  DefaultMouthPaths.Normal,
  DefaultMouthPaths.Sad,
].map((path) => Skia.Path.MakeFromSVGString(path));

// Convertit les chemins SVG des sourcils en objets Skia Path
const outputRangeEyebrow = [
  DefaultEyebrowPaths.Happy,
  DefaultEyebrowPaths.Normal,
  DefaultEyebrowPaths.Sad,
].map((path) => Skia.Path.MakeFromSVGString(path));

export const useIconPaths = () => {
  // Valeur partagée représentant l'état courant
  const progress = useSharedValue(AnimationType.Normal);

  // Animation progressive entre les états
  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress.value);
  }, [progress]);

  // Interpolation de la bouche
  const activeMouthPath = usePathInterpolation(
    animatedProgress,
    [AnimationType.Happy, AnimationType.Normal, AnimationType.Sad],
    outputRange
  );

  // Interpolation des sourcils
  const activeEyebrowPath = usePathInterpolation(
    progress,
    [AnimationType.Happy, AnimationType.Normal, AnimationType.Sad],
    outputRangeEyebrow
  );

  const happy = useCallback(() => {
    progress.value = AnimationType.Happy;
  }, [progress]);

  const sad = useCallback(() => {
    progress.value = AnimationType.Sad;
  }, [progress]);

  const normal = useCallback(() => {
    progress.value = AnimationType.Normal;
  }, [progress]);

  return {
    mouthPath: activeMouthPath,
    eyebrowPath: activeEyebrowPath,
    happy,
    sad,
    normal,
  };
};