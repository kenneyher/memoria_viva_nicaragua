import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import Stories from '../screens/Stories';
import Map from '../screens/Map';
import Calendar from '../screens/Calendar';
import Library from '../screens/Library';
import Learn from '../screens/Learn';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const isWeb = Platform.OS === 'web';
const { width } = Dimensions.get('window');
const isDesktop = isWeb && width > 768;

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Stories') {
          iconName = focused ? 'book' : 'book-outline';
        } else if (route.name === 'Map') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Calendar') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'Library') {
          iconName = focused ? 'library' : 'library-outline';
        } else if (route.name === 'Learn') {
          iconName = focused ? 'school' : 'school-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#FFC74F',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Stories" component={Stories} />
    <Tab.Screen name="Map" component={Map} />
    <Tab.Screen name="Calendar" component={Calendar} />
    <Tab.Screen name="Library" component={Library} />
    <Tab.Screen name="Learn" component={Learn} />
  </Tab.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FFC74F',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      drawerActiveTintColor: '#FFC74F',
      drawerInactiveTintColor: 'gray',
    }}
  >
    <Drawer.Screen 
      name="Stories" 
      component={Stories}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Map" 
      component={Map}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="map-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Calendar" 
      component={Calendar}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Library" 
      component={Library}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="library-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Learn" 
      component={Learn}
      options={{
        drawerIcon: ({ color, size }) => (
          <Ionicons name="school-outline" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

const ResponsiveNavigation = () => {
  if (isDesktop) {
    return <DrawerNavigator />;
  }
  
  return <TabNavigator />;
};

export default ResponsiveNavigation;
