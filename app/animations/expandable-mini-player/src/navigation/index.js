import { useCallback } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Screen } from '../components/navigation';
import { TabBar } from '../components/navigation/bottom-tab-bar';

const Tab = createBottomTabNavigator();

const DefaultScreen = () => <Screen title="Home" />;

export function Navigation() {
  const tabBar = useCallback(
    (props) => (
      <TabBar
        onTabPress={(routeName) => {
          props.navigation.navigate(routeName);
        }}
      />
    ),
    [],
  );

  return (
    <Tab.Navigator
      tabBar={tabBar}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="home" component={DefaultScreen} />
      <Tab.Screen name="search" component={DefaultScreen} />
      <Tab.Screen name="edit" component={DefaultScreen} />
      <Tab.Screen name="settings" component={DefaultScreen} />
    </Tab.Navigator>
  );
}