import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '@/app/(tabs)/explore';
import DiseaseDetailScreen from '@/components/DiseaseDetailScreen';
import { RouteProp } from '@react-navigation/native';

// Define the type for route.params
type RootStackParamList = {
  Explore: undefined;
  DiseaseDetail: { diseaseType: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Explore">
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen as React.Component}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
