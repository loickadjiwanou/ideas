import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { triggerHaptic } from "../utils/haptics";
import { useScreenTheme } from "../utils/ScreenThemeContext";

const CustomHeader = ({ title, titleColor, iconColor }) => {
  const navigation = useNavigation();
  const drawerStatus = useDrawerStatus();
  const rotation = useSharedValue(0);
  const { theme } = useScreenTheme();

  const autoColor = theme === "light" ? "#fff" : "#000";
  const resolvedTitleColor = titleColor ?? autoColor;
  const resolvedIconColor = iconColor ?? autoColor;

  useEffect(() => {
    if (drawerStatus === "open") {
      rotation.value = withTiming(1, { duration: 360 });
    } else {
      rotation.value = withTiming(0, { duration: 360 });
    }
  }, [drawerStatus]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 90]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const openDrawer = () => {
    triggerHaptic("light");
    navigation.openDrawer();
  };

  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={openDrawer}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.menuButton}
      >
        <Animated.View style={animatedStyle}>
          <Ionicons
            name={drawerStatus === "open" ? "close" : "menu"}
            size={36}
            color={resolvedIconColor}
          />
        </Animated.View>
      </TouchableOpacity>

      <Text style={[styles.title, { color: resolvedTitleColor }]}>
        {title}
      </Text>

      <View style={{ width: 36, height: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 55,
    width: "100%",
    height: 40,
    zIndex: 1001,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    left: 12,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "manropemedium",
    textAlign: "center",
  },
});

export default CustomHeader;