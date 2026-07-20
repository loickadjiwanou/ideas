import React from "react";
import { Drawer } from "expo-router/drawer";
import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DrawerContent from "../components/DrawerContent";
import {
  ScreenThemeProvider,
  useScreenTheme,
} from "../utils/ScreenThemeContext";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const { width } = Dimensions.get("window");

function RootDrawer() {
  const { theme } = useScreenTheme();
  const isDark = theme === "light";

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} translucent animated />
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#111",
            width: width * 0.75,
          },
          drawerActiveTintColor: "orange",
          drawerInactiveTintColor: "#aaa",
          overlayColor: "transparent",
          drawerType: "slide",
          sceneContainerStyle: {
            backgroundColor: "#000",
          },
        }}
      />
    </>
  );
}

const RootLayout = () => {
  const [fontsLoaded, fontsError] = useFonts({
    manroperegular: require("../assets/fonts/ManropeRegular.otf"),
    manropemedium: require("../assets/fonts/ManropeMedium.otf")
  });

  const onReady = React.useCallback(async () => {
    if (fontsLoaded || fontsError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  React.useEffect(() => {
    onReady();
  }, [onReady]);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <ScreenThemeProvider>
      <View style={styles.container}>
        <RootDrawer />
      </View>
    </ScreenThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default RootLayout;