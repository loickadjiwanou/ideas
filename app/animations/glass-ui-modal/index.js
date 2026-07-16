import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useSetScreenTheme from '../../../utils/ScreenThemeContext';
import { useFocusEffect } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SPRING_CONFIG = {
  damping: 26,
  stiffness: 260,
  mass: 0.9,
  overshootClamping: false,
};

const CLOSE_SPRING = {
  damping: 30,
  stiffness: 300,
  mass: 0.8,
};

const DISMISS_THRESHOLD = 140;
const DISMISS_VELOCITY = 1200;

// ─── Liquid Glass layer ──────────────────────────────────────────────────────

function GlassCard({ style, children, intensity = 55 }) {
  return (
    <View style={[styles.glassCard, style]}>
      <BlurView
        intensity={intensity}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      />
      {/* subtle top-edge specular line only */}
      <LinearGradient
        colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.00)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.shimmerTop}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionButton({ icon, label, color, onPress }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tap = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.92, { damping: 20, stiffness: 400 }); })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 18, stiffness: 380 });
      if (onPress) runOnJS(onPress)();
    });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.actionButton, animStyle]}>
        <GlassCard style={styles.actionButtonInner} intensity={48}>
          <View style={styles.actionButtonContent}>
            <Ionicons name={icon} size={22} color={color} />
            <Text style={styles.actionButtonText}>{label}</Text>
          </View>
        </GlassCard>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GlassUIModal() {
  useSetScreenTheme('light');

  const insets = useSafeAreaInsets();
  const isVisible = useSharedValue(0);
  const translateY = useSharedValue(height);
  const overlayOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      return () => {
        translateY.value = height;
        overlayOpacity.value = 0;
        isVisible.value = 0;
      };
    }, []),
  );

  const openModal = useCallback(() => {
    isVisible.value = 1;
    translateY.value = height;
    translateY.value = withSpring(0, SPRING_CONFIG);
    overlayOpacity.value = withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, []);

  const hideAfterClose = useCallback(() => {
    isVisible.value = 0;
  }, []);

  const closeModal = useCallback(() => {
    translateY.value = withSpring(
      height,
      CLOSE_SPRING,
      (finished) => { if (finished) hideAfterClose(); },
    );
    overlayOpacity.value = withTiming(0, { duration: 240, easing: Easing.in(Easing.cubic) });
  }, [hideAfterClose]);

  // button press scale
  const buttonTap = Gesture.Tap()
    .onBegin(() => { buttonScale.value = withSpring(0.88, { damping: 20, stiffness: 400 }); })
    .onFinalize(() => {
      buttonScale.value = withSpring(1, { damping: 16, stiffness: 350 });
      runOnJS(openModal)();
    });

  const panGesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
        overlayOpacity.value = interpolate(
          e.translationY,
          [0, 300],
          [1, 0.1],
        );
      }
    })
    .onEnd((e) => {
      const shouldClose =
        e.translationY > DISMISS_THRESHOLD || e.velocityY > DISMISS_VELOCITY;
      if (shouldClose) {
        translateY.value = withSpring(
          height,
          { ...CLOSE_SPRING, velocity: e.velocityY },
          (finished) => { if (finished) runOnJS(hideAfterClose)(); },
        );
        overlayOpacity.value = withTiming(0, { duration: 220 });
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
        overlayOpacity.value = withSpring(1, SPRING_CONFIG);
      }
    });

  // animated styles
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isVisibleStyle = useAnimatedStyle(() => ({
    display: isVisible.value === 1 ? 'flex' : 'none',
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Ambient glow orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />

      {/* Trigger button */}
      <GestureDetector gesture={buttonTap}>
        <Animated.View style={[styles.plusButton, buttonAnimStyle]}>
          <GlassCard style={styles.plusButtonInner} intensity={60}>
            <View style={styles.plusButtonContent}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
          </GlassCard>
        </Animated.View>
      </GestureDetector>

      {/* Modal layer — pan wraps everything so swipe works from anywhere on the sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.modalRoot, isVisibleStyle]}>
          {/* Backdrop */}
          <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 28 : 20}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(15,12,41,0.5)', 'rgba(36,36,62,0.72)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          </Animated.View>

          {/* Tap outside to close — only fires if pan doesn't activate */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

          {/* Sheet */}
          <Animated.View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 24) },
              modalStyle,
            ]}
          >
            {/* Drag handle */}
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            {/* Glass card */}
            <GlassCard style={styles.sheetCard} intensity={58}>
              <View style={styles.sheetContent}>
                {/* Icon */}
                <GlassCard style={styles.iconWrap} intensity={50}>
                  <View style={styles.iconWrapContent}>
                    <Ionicons name="sparkles" size={40} color="#fff" />
                  </View>
                </GlassCard>

                <Text style={styles.title}>Glass UI Modal</Text>
                <Text style={styles.subtitle}>
                  Liquid glass effect · iOS-inspired design
                </Text>

                {/* Action grid */}
                <View style={styles.actionGrid}>
                  <ActionButton icon="heart" label="Favoris" color="#FF6B9D" />
                  <ActionButton icon="share-social" label="Partager" color="#4ECDC4" />
                  <ActionButton icon="bookmark" label="Enregistrer" color="#FFD93D" />
                  <ActionButton icon="settings-sharp" label="Paramètres" color="#A78BFA" />
                </View>

                {/* Close button */}
                <Pressable
                  style={styles.closeBtn}
                  onPress={closeModal}
                  android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true }}
                >
                  <Text style={styles.closeBtnText}>Fermer</Text>
                </Pressable>
              </View>
            </GlassCard>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ambient orbs
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.45,
  },
  orb1: {
    width: 260,
    height: 260,
    top: -60,
    left: -80,
    backgroundColor: '#7c3aed',
    // soft glow via large shadow (iOS only)
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 80,
  },
  orb2: {
    width: 220,
    height: 220,
    bottom: 80,
    right: -60,
    backgroundColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 70,
  },

  // glass card primitive
  glassCard: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  shimmerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
  },

  // trigger button
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  plusButtonInner: {
    flex: 1,
    borderRadius: 32,
  },
  plusButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // modal root
  modalRoot: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },

  // sheet
  sheet: {
    width: width - 16,
    maxWidth: 520,
    marginBottom: 8,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  sheetCard: {
    borderRadius: 28,
  },
  sheetContent: {
    padding: 28,
    alignItems: 'center',
  },

  // icon
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 20,
  },
  iconWrapContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14.5,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },

  // action grid
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    width: '47.5%',
    height: 76,
    borderRadius: 18,
  },
  actionButtonInner: {
    flex: 1,
    borderRadius: 18,
  },
  actionButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },

  // close
  closeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  closeBtnText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
