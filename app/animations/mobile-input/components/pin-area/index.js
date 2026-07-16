import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Dots } from "./dots";

const PinArea = memo(({ activeDots, style, dotsAmount }) => {
  return (
    <View style={style}>
      <Text
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.9)",
          fontSize: 15,
        }}
      >
        Enter PIN Mode
      </Text>

      <Dots
        activeDots={activeDots}
        contentContainerStyle={styles.dotsContainer}
        amount={dotsAmount}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  dotsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    marginTop: 20,
    width: "100%",
  },
});

export { PinArea };