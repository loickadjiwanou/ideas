import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import spacing from "../../constants";

const NetworkLogo = ({ position = "bottomRight" }) => {
  return (
    <View
      style={[
        styles.networkLogo,
        position === "topRight" ? styles.topRight : styles.bottomRight,
      ]}
    >
      <LinearGradient
        colors={["#1A1A1A", "#4A4A4A", "#1A1A1A"]}
        locations={[0, 0.5, 1]}
        style={styles.networkCircle1}
      />

      <LinearGradient
        colors={["#4A4A4A", "#1A1A1A", "#4A4A4A"]}
        locations={[0, 0.5, 1]}
        style={styles.networkCircle2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomRight: {
    bottom: spacing.xl,
  },
  topRight: {
    top: spacing.xl,
  },
  networkLogo: {
    position: "absolute",
    right: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  networkCircle1: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.3)",
  },
  networkCircle2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.3)",
    marginLeft: -15,
  },
});

export default NetworkLogo;
