import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { useSetScreenTheme } from '../../../utils/ScreenThemeContext';
import { triggerHaptic } from '../../../utils/haptics';
import Blob from './blob';
import { COLOR_THEMES } from '../../../constants/blob-morphing';
import useMorphAnimation from '../../../hooks/blob-morphing/useMorphAnimation';

const BlobMorphingScreen = () => {
  useSetScreenTheme("light");
  const { morphTime, start } = useMorphAnimation();
  const [themeIndex, setThemeIndex] = useState(0);
  const tapScale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      start();
      return () => { };
    }, [start]),
  );

  const handleTap = useCallback(() => {
    triggerHaptic('medium');
    tapScale.value = withSequence(
      withTiming(0.94, { duration: 100 }),
      withTiming(1, { duration: 200 }),
    );
    setThemeIndex(prev => (prev + 1) % COLOR_THEMES.length);
  }, [tapScale]);

  const blobContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: tapScale.value }],
  }));

  const colors = COLOR_THEMES[themeIndex];

  return (
    <View style={styles.container}>

      <Text style={styles.title}>blob morphing</Text>

      <Pressable onPress={handleTap}>
        <Animated.View style={blobContainerStyle}>
          <Blob morphTime={morphTime} colors={colors} />
        </Animated.View>
      </Pressable>

      <View style={styles.dots}>
        {COLOR_THEMES.map((theme, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: theme[0],
                opacity: i === themeIndex ? 1 : 0.22,
                transform: [{ scale: i === themeIndex ? 1.45 : 1 }],
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.hint}>tap to change colors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08081A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  title: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 4,
    textTransform: 'lowercase',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hint: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 11,
    letterSpacing: 2,
  },
});

export default BlobMorphingScreen;