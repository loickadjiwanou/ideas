import React, { memo, useCallback, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { BlurredListItem } from "./blurred-list-item";
import { useSetScreenTheme } from "../../../utils/ScreenThemeContext";

const NUMBERS_ARRAY = new Array(100)
  .fill(0)
  .map((_, i) => i.toString())
  .reverse();

export const ScrollTransition3D = memo(() => {
  useSetScreenTheme("light");

  useFocusEffect(
    useCallback(() => {
      return () => { };
    }, [])
  );

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollY.value = event.contentOffset.y;
    },
  });

  const itemSize = windowWidth * 0.55;

  const contentContainerStyle = useMemo(() => {
    return {
      paddingVertical: windowHeight / 2 - itemSize / 2,
    };
  }, [itemSize, windowHeight]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: itemSize,
      offset: itemSize * index,
      index,
    }),
    [itemSize]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <BlurredListItem
        text={item}
        size={itemSize}
        index={index}
        scrollY={scrollY}
      />
    ),
    [itemSize, scrollY]
  );

  const keyExtractor = useCallback((item) => item, []);

  return (
    <View style={styles.container}>
      {/* <CustomHeader title="3D Scroll Transition" /> */}
      <Animated.FlatList
        inverted
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        data={NUMBERS_ARRAY}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        windowSize={2}
        snapToInterval={itemSize}
        decelerationRate="fast"
        renderItem={renderItem}
        scrollEventThrottle={16}
      />
    </View>
  );
});

ScrollTransition3D.displayName = "ScrollTransition3D";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
  },
});
