import React, {FC} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';


type DiseaseDetailRouteProp = RouteProp<RootStackParamList, 'DiseaseDetail'>;

export default function DiseaseDetail() {
  const route = useRoute<DiseaseDetailRouteProp>();
  const { disease } = route.params;

  return (
    <View style={styles.container}>
      <Image source={disease.image} style={styles.image} />
      <Text style={styles.title}>{disease.name}</Text>
      <Text style={styles.description}>{disease.description}</Text>
      <Text style={styles.moreInfo}>{disease.moreInfo}</Text>
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  moreInfo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#757575',
  },
});

export default DiseaseDetail;