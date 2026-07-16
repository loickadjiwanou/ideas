import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useDrawerStatus, useDrawerProgress } from "@react-navigation/drawer";
import { useDerivedValue, runOnJS } from "react-native-reanimated";

export const useDrawerBlur = () => {
  const drawerStatus = useDrawerStatus();
  const drawerProgress = useDrawerProgress();
  const [showBlur, setShowBlur] = useState(false);
  const [blurIntensity, setBlurIntensity] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useDerivedValue(() => {
    const progress = drawerProgress.value;

    runOnJS(setBlurIntensity)(Math.round(progress * 10));
    runOnJS(setOpacity)(progress);

    if (progress > 0) {
      runOnJS(setShowBlur)(true);
    } else {
      runOnJS(setShowBlur)(false);
    }
  }, [drawerProgress]);

  const BlurOverlay = showBlur ? (
    <BlurView
      intensity={blurIntensity}
      tint="dark"
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: opacity,
          zIndex: 1000,
        },
      ]}
    />
  ) : null;

  return BlurOverlay;
};
