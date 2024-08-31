import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Explore from '@/app/(tabs)/explore';
import DiseaseDetailScreen from '@/components/DiseaseDetail';
import Camera from '@/app/(tabs)/camera'; // Import your camera screen
import { RootStackParamList } from '@/components/navigation/types'; // Import the RootStackParamList

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Explore">
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
        <Stack.Screen name="camera" component={Camera}/> {/* Add Camera to the stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
