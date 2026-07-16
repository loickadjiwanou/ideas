import { memo } from "react";
import { View } from "react-native";
import { Dot } from "./dot";

const Dots = memo(
  ({ contentContainerStyle, activeDots, amount = 5 }) => {
    return (
      <View style={contentContainerStyle}>
        {new Array(amount).fill(0).map((_, index) => (
          <Dot
            key={index}
            index={index}
            activeDots={activeDots}
          />
        ))}
      </View>
    );
  }
);

export { Dots };