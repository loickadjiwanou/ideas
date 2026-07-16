import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSetScreenTheme } from '../../../utils/ScreenThemeContext';

const { width } = Dimensions.get('window');

// ─── Config ──────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'home',          label: 'Home',    icon: 'house.fill',    ionicon: 'home' },
  { key: 'search',        label: 'Search',  icon: 'magnifyingglass', ionicon: 'search' },
  { key: 'library',       label: 'Library', icon: 'books.vertical.fill', ionicon: 'library' },
  { key: 'profile',       label: 'Profile', icon: 'person.crop.circle.fill', ionicon: 'person-circle' },
];

const TAB_BAR_HEIGHT = 64;
const PILL_H_PADDING = 8;
const SPRING = { damping: 20, stiffness: 200, mass: 0.7 };

// ─── Tab bar ─────────────────────────────────────────────────────────────────

function TabBar({ pillX, activeIndex, onPress, scrollY, insets }) {
  const tabW = (width - 32 - PILL_H_PADDING * 2) / TABS.length;

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  // hide on scroll
  const barStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, 80],
        [0, TAB_BAR_HEIGHT + 40],
        Extrapolation.CLAMP,
      ),
    }],
    opacity: interpolate(scrollY.value, [0, 60], [1, 0], Extrapolation.CLAMP),
  }));

  const bottom = Math.max(insets.bottom, 8) + 8;

  return (
    <Animated.View style={[styles.barWrap, { bottom }, barStyle]}>
      {/* shadow — outside overflow:hidden so it's not clipped */}
      <View style={[styles.barShadow, { borderRadius: TAB_BAR_HEIGHT / 2 }]} />

      {/* pill */}
      <View style={styles.barPill}>
        {/* opaque base so pill always contrasts with background */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={['rgba(235,235,240,0.96)', 'rgba(245,245,250,0.96)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* blur layer */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 55 : 45}
          tint="systemUltraThinMaterialLight"
          style={StyleSheet.absoluteFill}
        />

        {/* top specular */}
        <LinearGradient
          colors={['rgba(255,255,255,0.65)', 'rgba(255,255,255,0.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.shimmer}
          pointerEvents="none"
        />

        {/* sliding active indicator */}
        <Animated.View style={[styles.activePill, { width: tabW }, pillStyle]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.98)', 'rgba(248,248,252,0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* tab buttons */}
        <View style={styles.tabRow}>
          {TABS.map((tab, index) => (
            <TabButton
              key={tab.key}
              tab={tab}
              index={index}
              activeIndex={activeIndex}
              tabW={tabW}
              onPress={onPress}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Single tab button ────────────────────────────────────────────────────────

function TabButton({ tab, index, activeIndex, tabW, onPress }) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => {
    const active = activeIndex.value === index;
    return {
      opacity: withTiming(active ? 1 : 0.5, { duration: 200 }),
      transform: [{ scale: scale.value }],
    };
  });

  const tap = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.82, { damping: 18, stiffness: 380 }); })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 16, stiffness: 340 });
      runOnJS(onPress)(index);
    });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.tabBtn, { width: tabW }, animStyle]}>
        <Ionicons name={tab.ionicon} size={22} color="#1c1c1e" />
        <Text style={styles.tabLabel}>{tab.label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Screen content ───────────────────────────────────────────────────────────

const SCREEN_COLORS = {
  home:    ['#f0f4ff', '#e8edf8'],
  search:  ['#f5f0ff', '#ede8f8'],
  library: ['#f0fff4', '#e8f8ed'],
  profile: ['#fff8f0', '#f8f0e8'],
};

const CARD_COLORS = {
  home:    ['#dde8ff', '#c8d8f8'],
  search:  ['#e8d8ff', '#d8c8f8'],
  library: ['#d8ffe8', '#c8f8d8'],
  profile: ['#ffe8d8', '#f8d8c8'],
};

function ScreenContent({ tabKey, scrollY, insets }) {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  const bg = SCREEN_COLORS[tabKey] ?? ['#f2f2f7', '#e5e5ea'];
  const cardBg = CARD_COLORS[tabKey] ?? ['#e5e5ea', '#d8d8dd'];

  return (
    <LinearGradient colors={bg} style={styles.screenFill}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 24 },
        ]}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <View key={i} style={styles.card}>
            <LinearGradient
              colors={cardBg}
              style={styles.cardThumb}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.cardBody}>
              <View style={[styles.cardLine, { width: '80%', backgroundColor: cardBg[0] }]} />
              <View style={[styles.cardLine, { width: '55%', backgroundColor: cardBg[0] }]} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </LinearGradient>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LiquidGlassBottomNavBar() {
  useSetScreenTheme('dark');
  const insets = useSafeAreaInsets();
  const activeIndex = useSharedValue(0);
  const scrollY = useSharedValue(0);

  // tabW computed once — same formula as in TabBar
  const tabW = (width - 32 - PILL_H_PADDING * 2) / TABS.length;
  // pillX is the source of truth for the pill position, animated directly
  const pillX = useSharedValue(0);

  const [activeKey, setActiveKey] = React.useState('home');

  useFocusEffect(useCallback(() => {
    return () => {
      scrollY.value = 0;
    };
  }, []));

  const handleTabPress = useCallback((index) => {
    activeIndex.value = index;
    pillX.value = withSpring(index * tabW, SPRING);
    scrollY.value = withTiming(0, { duration: 300 });
    setActiveKey(TABS[index].key);
  }, [tabW]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ScreenContent
        tabKey={activeKey}
        scrollY={scrollY}
        insets={insets}
      />
      <TabBar
        pillX={pillX}
        activeIndex={activeIndex}
        onPress={handleTabPress}
        scrollY={scrollY}
        insets={insets}
      />
    </GestureHandlerRootView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenFill: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },

  // cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardThumb: {
    height: 160,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardLine: {
    height: 13,
    borderRadius: 7,
  },

  // tab bar
  barWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: TAB_BAR_HEIGHT,
  },
  barShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  barPill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(180,180,190,0.8)',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    zIndex: 1,
  },

  // active pill
  activePill: {
    position: 'absolute',
    top: PILL_H_PADDING,
    bottom: PILL_H_PADDING,
    left: PILL_H_PADDING,
    borderRadius: (TAB_BAR_HEIGHT - PILL_H_PADDING * 2) / 2,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // tab row
  tabRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: PILL_H_PADDING,
    zIndex: 2,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1c1c1e',
    letterSpacing: 0.2,
  },
});
