import { StyleSheet, Text, View } from "react-native";
import { useCallback } from "react";
import { Image } from "expo-image";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import PressableScale from "./pressable-scale";

export const ListItem = ({
  index,
  item,
  onTap,
  buttonStyle,
  selectedIndex,
  confirmButtonChildren,
  animationProgress,
  style,
}) => {
  const viewRef = useAnimatedRef();

  const onPress = useCallback(() => {
    "worklet";
    const layout = measure(viewRef);
    if (onTap)
      scheduleOnRN(onTap, {
        item,
        index,
        layout: layout ?? {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          pageX: 0,
          pageY: 0,
        },
      });
  }, [index, item, onTap, viewRef]);

  // Utiliser useDerivedValue pour éviter l'accès direct à .value pendant le render
  const isAnimating = useDerivedValue(() => {
    return selectedIndex.value === index;
  }, [index]);

  const rButtonContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: isAnimating.value ? 0 : 1,
    };
  }, []);

  const rCounterStyle = useAnimatedStyle(() => {
    return {
      opacity: isAnimating.value ? (1 - animationProgress.value) ** 2 : 1,
    };
  }, []);

  return (
    <View key={index} style={style}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
          cachePolicy={"memory-disk"}
          style={{
            height: "65%",
            aspectRatio: 1,
            borderRadius: 10,
            // @@TODO: the image should support borderCurve
            borderCurve: "continuous",
          }}
          source={{
            uri: item.imageUri,
          }}
        />
        <View style={{ paddingLeft: 10, justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            {item.title}
          </Text>
          <Text
            numberOfLines={2}
            style={{ maxWidth: "80%", color: "rgba(0,0,0,0.8)" }}
          >
            {item.description}
          </Text>
        </View>
      </View>
      <PressableScale onPress={onPress} style={{ overflow: "visible" }}>
        {Boolean(item.count) && (
          <Animated.View style={[styles.badge, rCounterStyle]}>
            <Text
              style={{
                color: "white",
                fontSize: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {item.count}
            </Text>
          </Animated.View>
        )}
        <Animated.View
          ref={viewRef}
          style={[buttonStyle, rButtonContainerStyle]}
        >
          {confirmButtonChildren}
        </Animated.View>
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#D12727",
    borderRadius: 10,
    height: 15,
    justifyContent: "center",
    position: "absolute",
    right: -2.5,
    top: -2.5,
    zIndex: 100,
  },
});
