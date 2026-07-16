import { Ionicons } from "@expo/vector-icons";
import { NavigationIndependentTree } from "@react-navigation/core";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { AnimatedTabBar } from "./motion-tabs/animated-tab-bar";
import CustomHeader from "../../../components/CustomHeader";
import { useSetScreenTheme } from "../../../utils/ScreenThemeContext";

const Tab = createBottomTabNavigator();

function PlaceholderScreen({ label }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenTitle}>{label}</Text>
      <Text style={styles.screenHint}>Tap a tab icon to open its popup</Text>
    </View>
  );
}

function HomeScreen() {
  return <PlaceholderScreen label="Home" />;
}

function SearchScreen() {
  return <PlaceholderScreen label="Search" />;
}

function ProfileScreen() {
  return <PlaceholderScreen label="Profile" />;
}

function MotionTabsNavigator() {
  return (
    <Tab.Navigator
      detachInactiveScreens={Platform.OS !== "ios"}
      screenOptions={{
        animation: "shift",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: 0,
          position: "absolute",
        },
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function ExpoMotionTabs() {
  useSetScreenTheme("dark");

  useFocusEffect(
    useCallback(() => {
      return () => { };
    }, []),
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Motion Tabs" />
      <NavigationIndependentTree>
        <MotionTabsNavigator />
      </NavigationIndependentTree>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  screenHint: {
    fontSize: 14,
    color: "#888",
  },
});
