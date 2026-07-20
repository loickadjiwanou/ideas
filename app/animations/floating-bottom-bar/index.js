import React, { useCallback } from "react";
import { View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BottomTabBar from "./components/bottom-tab-bar";
import { ScreenNames } from "./constants/screens";

const BottomTab = createBottomTabNavigator();

const FloatingBottomBar = () => {
  const tabBar = useCallback((props) => {
    return <BottomTabBar {...props} />;
  }, []);

  return (
    <BottomTab.Navigator tabBar={tabBar}>
      <BottomTab.Screen name={ScreenNames.Home} component={View} />
      <BottomTab.Screen name={ScreenNames.Bookmark} component={View} />
      <BottomTab.Screen name={ScreenNames.Add} component={View} />
      <BottomTab.Screen name={ScreenNames.Profile} component={View} />
      <BottomTab.Screen name={ScreenNames.Settings} component={View} />
    </BottomTab.Navigator>
  );
};

export default FloatingBottomBar;