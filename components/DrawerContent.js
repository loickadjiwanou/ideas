import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import { LegendList } from "@legendapp/list";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeviceWidth } from "../utils/device-dimensions";
import { AppAssets } from "../utils/app-assets";
import { triggerHaptic } from "../utils/haptics";

const DrawerContentWidth = DeviceWidth * 0.75;

const menuItems = [
  { label: "/", route: "/", slug: "home" },
  {
    label: "Collapsible Header",
    route: "/animations/collapsible-header/collapsible-header",
    slug: "collapsible-header",
  },
  {
    label: "3D Scroll Transition",
    route: "/animations/3d-scroll-transition/scroll-transition-3d",
    slug: "3d-scroll-transition",
  },
  {
    label: "Action Tray",
    route: "/animations/action-tray",
    slug: "action-tray",
  },
  {
    label: "Add to Cart",
    route: "/animations/add-to-card",
    slug: "add-to-card",
  },
  {
    label: "Airbnb Flip Interaction",
    route: "/animations/airbnb-flip-interaction",
    slug: "airbnb-flip-interaction",
  },
  {
    label: "Glass UI Modal",
    route: "/animations/glass-ui-modal",
    slug: "glass-ui-modal",
  },
  {
    label: "Liquid Glass Bottom Nav Bar",
    route: "/animations/liquid-glass-bottom-nav-bar",
    slug: "liquid-glass-bottom-nav-bar",
  },
  {
    label: "Blob Morphing",
    route: "/animations/blob-morphing",
    slug: "blob-morphing",
  },
  {
    label: "Ticket Card Modal",
    route: "/animations/ticket-card-modal",
    slug: "ticket-card-modal",
  },
  {
    label: "Expo Motion Tabs",
    route: "/animations/expo-motion-tabs",
    slug: "expo-motion-tabs",
  },
  {
    label: "Example",
    route: "/animations/example",
    slug: "example",
  },
  {
    label: "Voice Chat Orb",
    route: "/animations/voice-chat-orb",
    slug: "voice-chat-orb",
  },
  {
    label: "Mobile Input",
    route: "/animations/mobile-input",
    slug: "mobile-input",
  },
  {
    label: "Expandable Mini Player",
    route: "/animations/expandable-mini-player",
    slug: "expandable-mini-player",
  },
  {
    label: "Verification Code Face",
    route: "/animations/verification-code-face",
    slug: "verification-code-face",
  },
  {
    label: "Floating Bottom Bar",
    route: "/animations/floating-bottom-bar",
    slug: "floating-bottom-bar",
  },
].sort((a, b) => a.label.localeCompare(b.label));

const GradientColors = ["#030303", "#03030300"];
const LIST_ITEM_HEIGHT = 50;

const DrawerListItem = ({ item, style, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.6}>
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const keyExtractor = (item) => item?.slug || "";

const DrawerContent = (props) => {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [searchFilter, setSearchFilter] = useState("");
  const listRef = useRef(null);

  const filteredAnimations = useMemo(() => {
    if (!searchFilter.trim()) {
      return menuItems;
    }
    const filter = searchFilter.toLowerCase();
    return menuItems.filter((item) =>
      item.label.toLowerCase().includes(filter),
    );
  }, [searchFilter]);

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <DrawerListItem
          item={item}
          style={styles.listItem}
          onPress={() => {
            Keyboard.dismiss();
            triggerHaptic("selection");
            router.push(item.route);
          }}
        />
      );
    },
    [router],
  );

  const handleSearchChange = useCallback((event) => {
    setSearchFilter(event.nativeEvent.text);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: 0, animated: false });
    });
  }, []);

  const contentContainerStyle = useMemo(() => {
    return { paddingBottom: bottom, marginTop: 12 };
  }, [bottom]);

  const scrollComponent = useCallback((props) => {
    return <ScrollView {...props} />;
  }, []);

  const estimatedListSize = useMemo(() => {
    return {
      height: LIST_ITEM_HEIGHT * filteredAnimations.length,
      width: DrawerContentWidth,
    };
  }, [filteredAnimations]);

  const handleTitlePress = useCallback(() => {
    triggerHaptic("selection");
    router.push("/");
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={handleTitlePress}
            activeOpacity={0.7}
            style={styles.logoTitleContainer}
          >
            <Image source={AppAssets.appIcon} style={styles.logo} />
            <Text style={styles.title}>ideas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="always"
            style={styles.searchInput}
            placeholderTextColor="#666"
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </View>
      </View>

      <View style={styles.listContainer}>
        <LegendList
          recycleItems={false}
          waitForInitialLayout
          ref={listRef}
          renderItem={renderItem}
          scrollEventThrottle={16}
          data={filteredAnimations}
          estimatedListSize={estimatedListSize}
          keyExtractor={keyExtractor}
          keyboardDismissMode="on-drag"
          estimatedItemSize={LIST_ITEM_HEIGHT}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={contentContainerStyle}
          renderScrollComponent={scrollComponent}
        />

        <LinearGradient
          pointerEvents="none"
          style={styles.topGradient}
          colors={GradientColors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#03030300",
    flex: 1,
  },
  header: {
    gap: 8,
    marginBottom: 16,
    marginTop: 6,
    paddingHorizontal: 16,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  logoTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  searchContainer: {
    marginBottom: 0,
    marginTop: 6,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#cdcdcdff",
    borderRadius: 12,
    borderWidth: 0,
    color: "#000",
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listContainer: {
    flex: 1,
    position: "relative",
  },
  listItem: {
    height: LIST_ITEM_HEIGHT,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  menuLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  topGradient: {
    height: 8,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
});

export default DrawerContent;