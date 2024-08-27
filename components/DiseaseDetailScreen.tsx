import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define the type for route.params
type RootStackParamList = {
  DiseaseDetail: { diseaseType: string };
};

type DiseaseDetailScreenRouteProp = RouteProp<RootStackParamList, 'DiseaseDetail'>;

type Props = {
  route: DiseaseDetailScreenRouteProp;
};

const DiseaseDetailScreen: React.FC<Props> = ({ route }) => {
  const { diseaseType } = route.params;

  const diseaseDetails: { [key: string]: string } = {
    'Skin Lesion': 'Details about Skin Lesion...',
    'Behavior': 'Details about Behavioral Issues...',
    'Color of Eyes': 'Details about Eye Color Issues...',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{diseaseType}</Text>
      <Text style={styles.description}>{diseaseDetails[diseaseType]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DiseaseDetailScreen;