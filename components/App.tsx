import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import explore from '@/app/(tabs)/explore'; // Path based on your file structure
import DiseaseDetailScreen from '@/app/screens/DiseaseDetailScreen';
import Camera from '@/app/(tabs)/camera'; // Adjust based on your file structure
import { RootStackParamList } from '@/components/navigation/types'; // Import the RootStackParamList

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="explore">
        <Stack.Screen name="explore" component={explore} />
        <Stack.Screen name="DiseaseDetailScreen" component={DiseaseDetailScreen} />
        <Stack.Screen name="camera" component={Camera}/> {/* Add Camera to the stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
