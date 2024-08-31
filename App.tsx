import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import explore from '@/app/(tabs)/explore';
import DiseaseDetailScreen from '@/app/DiseaseDetailScreen';
import camera from '@/app/(tabs)/camera'; // Import your camera screen
import { RootStackParamList } from '@/components/navigation/types'; // Import the RootStackParamList

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="explore">
        <Stack.Screen name="explore" component={explore} />
        <Stack.Screen name="DiseaseDetailScreen" component={DiseaseDetailScreen} />
        <Stack.Screen name="camera" component={camera}/> {/* Add Camera to the stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}