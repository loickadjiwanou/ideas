import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

import { InputButton } from "./input-button";

const items = [
  { label: 1 },
  { label: 2 },
  { label: 3 },
  { label: 4 },
  { label: 5 },
  { label: 6 },
  { label: 7 },
  { label: 8 },
  { label: 9 },
  { label: null },
  { label: 0 },
  { label: "backspace" },
];

const ButtonsGrid = memo(({ pin, onReset }) => {
  return (
    <View style={styles.container}>
      {items.map(({ label }, index) => (
        <InputButton
          key={index}
          style={styles.input}
          onPress={() => {
            if (typeof label === "number") {
              pin.value = [...pin.value, label];
              return;
            }

            if (label === "backspace") {
              onReset?.();
            }
          }}
        >
          {typeof label === "number" && (
            <Text style={styles.number}>{label}</Text>
          )}

          {label === "backspace" && (
            <FontAwesome5 name={label} size={24} color="white" />
          )}
        </InputButton>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    alignItems: "center",
    height: "20%",
    justifyContent: "center",
    marginBottom: `${7 / 3}%`,
    marginLeft: `${7 / 3}%`,
    width: "30%",
  },
  number: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
});

export { ButtonsGrid };