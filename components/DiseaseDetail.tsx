import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Define the type for route.params
type RootStackParamList = {
  Explore: undefined;
  DiseaseDetail: {
    name: string;
    description: string;
    image: any;
    moreInfo: string;
  };
};

type DiseaseDetailScreenRouteProp = RouteProp<RootStackParamList, 'DiseaseDetail'>;

type Props = {
  route: DiseaseDetailScreenRouteProp;
};

const DiseaseDetail: React.FC<Props> = ({ route }) => {
  const { name, description, image, moreInfo } = route.params;

  //const imageSource = require(image); // Dynamically require the imae

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.moreInfo}>{moreInfo}</Text>
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