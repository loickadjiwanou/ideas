import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Orb({ size = 160, active = false }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: active ? 3800 : 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();
    return () => {
      rotateLoop.stop();
      rotation.setValue(0);
    };
  }, [active]);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: active ? 520 : 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: active ? 520 : 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [active]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinReverse = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: active ? [0.92, 1.1] : [0.97, 1.03],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.layer,
          {
            width: size * 1.25,
            height: size * 1.25,
            borderRadius: (size * 1.25) / 2,
            opacity: 0.22,
            transform: [{ scale }],
          },
        ]}
      >
        <LinearGradient
          colors={['#5B6EE8', '#6F7BEA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: (size * 1.25) / 2 }]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.layer,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }, { scale }],
          },
        ]}
      >
        <LinearGradient
          colors={['#4E5FC7', '#6470D6', '#7A82D9', '#4E5FC7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: size / 2 }]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.layer,
          {
            width: size * 0.78,
            height: size * 0.78,
            transform: [{ rotate: spinReverse }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 0.9 }}
          style={[styles.gradient, { borderRadius: (size * 0.78) / 2 }]}
        />
      </Animated.View>

      <View
        style={[
          styles.core,
          {
            width: size * 0.92,
            height: size * 0.92,
            borderRadius: (size * 0.92) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  core: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
