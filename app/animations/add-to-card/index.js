import { FlatList, StyleSheet, Text, View } from "react-native";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Backdrop from "./components/backdrop";
import BottomSheet from "./components/bottom-sheet";
import ConfirmButton from "./components/confirm-button";
import ListItem from "./components/list-item";
import CustomHeader from "../../../components/CustomHeader";
import { useSetScreenTheme } from "../../../utils/ScreenThemeContext";

const items = new Array(20).fill(0).map((_, index) => ({
  id: index,
  title: `Item ${index}`,
  imageUri:
    "https://images.unsplash.com/photo-1662880195918-63fecf8a8b71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
  description:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae itaque quae, deleniti distinctio laudantium, doloremque debitis, fugiat ea alias sint dolor qui? Quo tempore, ab aliquam repellendus veritatis aspernatur cupiditate.",
  count: 0,
}));

export default function AddToCart() {
  useSetScreenTheme("dark");

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );

  const [listItems, setListItems] = useState(items);
  const { top } = useSafeAreaInsets();
  const animationProgress = useSharedValue(0);
  const layoutData = useSharedValue(null);
  const selectedIndex = useSharedValue(null);
  const onTap = useCallback(
    ({ index, layout }) => {
      cancelAnimation(animationProgress);
      animationProgress.value = 0;
      layoutData.value = { ...layout };
      selectedIndex.value = index;
      animationProgress.value = withSpring(1, {
        dampingRatio: 1,
        duration: 500,
      });
    },
    [animationProgress, layoutData, selectedIndex]
  );

  const onDismiss = useCallback(() => {
    animationProgress.value = withSpring(
      0,
      {
        dampingRatio: 1,
        duration: 500,
      },
      (hasCompleted) => {
        if (hasCompleted) {
          layoutData.value = null;
          selectedIndex.value = null;
        }
      }
    );
  }, [animationProgress, layoutData, selectedIndex]);

  const onConfirm = useCallback(() => {
    'worklet';
    const index = selectedIndex.value;
    if (index === null) {
      return;
    }
    runOnJS(setListItems)((prevListItems) => {
      return prevListItems.map((item) => {
        if (item.id === index) {
          return {
            ...item,
            count: item.count + 1,
          };
        }
        return item;
      });
    });
    runOnJS(onDismiss)();
  }, [onDismiss]);

  const rConfirmTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animationProgress.value,
        [0.5, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
      flex: interpolate(
        animationProgress.value,
        [0, 1],
        [0, 4],
        Extrapolation.CLAMP
      ),
    };
  }, []);

  const confirmButtonChildren = useMemo(() => {
    return <Feather name="shopping-cart" size={18} color="white" />;
  }, []);

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.header}>
        {/* <CustomHeader title={"Add to Cart"} /> */}
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={listItems}
        contentContainerStyle={{
          paddingBottom: 100,
          //   paddingTop: top + 24,
          paddingTop: 6,
        }}
        renderItem={({ item }) => {
          return (
            <ListItem
              item={item}
              selectedIndex={selectedIndex}
              onTap={onTap}
              key={item.id}
              index={item.id}
              style={styles.listItem}
              animationProgress={animationProgress}
              buttonStyle={[
                styles.buyButton,
                {
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              confirmButtonChildren={confirmButtonChildren}
            />
          );
        }}
      />
      <Backdrop animationProgress={animationProgress} onPress={onDismiss} />
      <ConfirmButton
        layoutData={layoutData}
        animationProgress={animationProgress}
        onConfirm={onConfirm}
        style={[
          styles.buyButton,
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Animated.View style={rConfirmTextStyle}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              paddingHorizontal: 15,
            }}
          >
            Add to cart
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {confirmButtonChildren}
        </Animated.View>
      </ConfirmButton>
      <BottomSheet animationProgress={animationProgress} />
    </View>
  );
}

const styles = StyleSheet.create({
  buyButton: {
    backgroundColor: "#000",
    borderCurve: "continuous",
    borderRadius: 10,
    height: 40,
    width: 40,
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    // height: 110,
    backgroundColor: "white",
    height: 50
  },
  listItem: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "white",
    borderCurve: "continuous",
    borderRadius: 10,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
    flexDirection: "row",
    height: 85,
    justifyContent: "space-between",
    margin: 10,
    paddingLeft: 15,
    paddingRight: 20,
    width: "90%",
  },
});
