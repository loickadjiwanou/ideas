import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useFocusEffect } from "expo-router";
import { useRef, useCallback, useEffect } from "react";
import CustomHeader from "../components/CustomHeader";
import StaggeredText from "./animations/staggered-text/staggered-text";
import { DeviceWidth, DeviceHeight } from "../utils/device-dimensions";
import useSetScreenTheme from "../utils/ScreenThemeContext";
import triggerHaptic from "../utils/haptics";

export default function Main() {
  useSetScreenTheme("light");

  useFocusEffect(
    useCallback(() => {
      return () => { };
    }, [])
  );
  const staggeredTextRef = useRef(null);
  const textContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      staggeredTextRef.current?.animate(1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePress = useCallback((event) => {
    triggerHaptic('light');
    textContainerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      const touchY = event.nativeEvent.pageY;
      const centerY = pageY + height / 2;

      const direction = touchY < centerY ? 1 : -1;

      staggeredTextRef.current?.reset();
      setTimeout(() => {
        staggeredTextRef.current?.animate(direction);
      }, 50);
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title={"ideas"} />

      <View style={styles.content}>
        <Pressable
          onPress={handlePress}
          style={[
            {
              paddingHorizontal: DeviceWidth * 0.15,
              paddingVertical: DeviceHeight * 0.35,
            },
          ]}
        >
          <View ref={textContainerRef}>
            <StaggeredText
              ref={staggeredTextRef}
              text="Welcome to Ideas"
              fontSize={30}
              textStyle={styles.text}
              enableReverse={false}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  text: {
    color: "#fff",
    fontFamily: "manropemedium",
    fontSize: 30,
  },
});
