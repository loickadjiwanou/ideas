import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import { AppAssets } from "../../../utils/app-assets";
import useSetScreenTheme from "../../../utils/ScreenThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.45);
const COMPACT_HEADER_HEIGHT = 90;
const TITLE_APPEAR_OFFSET = HEADER_HEIGHT - COMPACT_HEADER_HEIGHT - 50;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const CollapsibleHeader = ({ navigation }) => {
  useSetScreenTheme("light");
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - COMPACT_HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * 0.5],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2.5, 1],
    extrapolate: "clamp",
  });

  const blurIntensity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.7],
    outputRange: [0, 30],
    extrapolate: "clamp",
  });

  const compactHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - COMPACT_HEADER_HEIGHT],
    outputRange: [-100, 0],
    extrapolate: "clamp",
  });

  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [TITLE_APPEAR_OFFSET, HEADER_HEIGHT - COMPACT_HEADER_HEIGHT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const bigTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.4],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const bigTitleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  const actionButtonsOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const ARTIST_NAME = "Stromae";

  const TrackItem = ({ index, isPlaying }) => (
    <TouchableOpacity style={styles.trackCard} activeOpacity={0.7}>
      <View style={styles.trackLeft}>
        <Text style={styles.trackNumber}>{index + 1}</Text>
        <Image
          source={AppAssets.collapsibleHeaderArtistImage}
          style={styles.trackImage}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {`Morceau populaire ${index + 1}`}
          </Text>
          <Text style={styles.trackStreams}>
            {(Math.random() * 500 + 50).toFixed(0)}M écoutes
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.trackRight}>
        <Ionicons name="ellipsis-horizontal" size={22} color="#b3b3b3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
        }}
        contentInsetAdjustmentBehavior="never"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Populaires</Text>
          {Array.from({ length: 5 }).map((_, i) => (
            <TrackItem key={i} index={i} isPlaying={i === 0} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <View style={styles.aboutCard}>
            <Image
              source={AppAssets.collapsibleHeaderArtistImage}
              style={styles.aboutImage}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(18,18,18,0.9)"]}
              style={styles.aboutGradient}
            />
            <View style={styles.aboutContent}>
              <Text style={styles.monthlyListeners}>
                12 439 892 auditeurs mensuels
              </Text>
              <Text style={styles.aboutText} numberOfLines={3}>
                Artiste belge de renommée internationale, connu pour ses textes
                engagés et son style musical unique mélangeant pop, électro et
                chanson française.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.headerWrapper,
          {
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslateY }],
          },
        ]}
        pointerEvents="box-none"
      >
        <Animated.Image
          source={AppAssets.collapsibleHeaderArtistImage}
          style={[
            styles.headerImage,
            {
              transform: [{ scale: imageScale }],
            },
          ]}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(18,18,18,1)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
          pointerEvents="none"
        />

        <AnimatedBlurView
          intensity={blurIntensity}
          tint="dark"
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: scrollY.interpolate({
                inputRange: [0, HEADER_HEIGHT * 0.7],
                outputRange: [0, 0.6],
                extrapolate: "clamp",
              }),
            },
          ]}
          pointerEvents="none"
        />

        <Animated.View
          style={[
            styles.bigTitleContainer,
            {
              opacity: bigTitleOpacity,
              transform: [{ translateY: bigTitleTranslateY }],
            },
          ]}
        >
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={18} color="#3b82f6" />
            <Text style={styles.verifiedText}>Artiste vérifié</Text>
          </View>
          <Text style={styles.bigTitle}>{ARTIST_NAME}</Text>
          <Text style={styles.subTitle}>12,4M d'auditeurs mensuels</Text>
        </Animated.View>

        <Animated.View
          style={[styles.headerActions, { opacity: actionButtonsOpacity }]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text
              style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText,
              ]}
            >
              {isFollowing ? "Suivi(e)" : "Suivre"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shuffleButton}>
            <Ionicons name="shuffle" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={28} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.customHeaderWrapper,
          {
            opacity: bigTitleOpacity,
            paddingTop: insets.top,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* <CustomHeader title={""} /> */}
      </Animated.View>

      <Animated.View
        style={[
          styles.compactHeaderContainer,
          {
            paddingTop: insets.top,
            opacity: compactHeaderOpacity,
            transform: [{ translateY: compactHeaderTranslateY }],
          },
        ]}
        pointerEvents="auto"
      >
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.compactHeaderContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.compactTitle} numberOfLines={1}>
            {ARTIST_NAME}
          </Text>

          <View style={styles.compactActions}>
            <TouchableOpacity style={styles.compactActionButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#121212",
  },
  compactHeaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  compactHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  compactTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  compactActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  compactActionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: "hidden",
    zIndex: 1,
  },
  customHeaderWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  headerImage: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    position: "absolute",
    top: 0,
  },
  bigTitleContainer: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  verifiedText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  bigTitle: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: -1,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    marginBottom: 8,
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.9,
  },
  headerActions: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 10,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  followingButton: {
    borderColor: "#535353",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  followingButtonText: {
    color: "#b3b3b3",
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1ed760",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  trackLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trackNumber: {
    color: "#b3b3b3",
    fontSize: 16,
    fontWeight: "400",
    width: 24,
    textAlign: "center",
  },
  trackImage: {
    width: 52,
    height: 52,
    borderRadius: 4,
    marginLeft: 12,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
    marginBottom: 4,
  },
  trackStreams: {
    color: "#b3b3b3",
    fontSize: 13,
  },
  trackRight: {
    padding: 8,
  },
  aboutCard: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  aboutImage: {
    width: "100%",
    height: "100%",
  },
  aboutGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  aboutContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  monthlyListeners: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  aboutText: {
    color: "#b3b3b3",
    fontSize: 13,
    lineHeight: 18,
  },
});

export default CollapsibleHeader;
