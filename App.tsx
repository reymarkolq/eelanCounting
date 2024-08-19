import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import CaptureScreen from './screens/CaptureScreen';
import DiseaseDetectionScreen from './screens/DiseaseDetectionScreen';
import { Colors } from './constants/Colors';
import { useColorScheme } from './hooks/useColorScheme';
import { TabBarIcon } from './navigation/TabBarIcon';

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tint,
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Capture" 
          component={CaptureScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Detection" 
          component={DiseaseDetectionScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
