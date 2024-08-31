import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types'; // Adjust the import path as needed
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ExploreScreen from '@/app/(tabs)/explore';

// Define the props for the component
type DiseaseDetailScreenRouteProp = RouteProp<RootStackParamList, 'DiseaseDetailScreen'>;
type DiseaseDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DiseaseDetailScreen'>;

type Props = {
  route: DiseaseDetailScreenRouteProp;
  navigation: DiseaseDetailScreenNavigationProp;
};

const DiseaseDetailScreen: React.FC<Props> = ({ route }) => {
  const { name, description, image, moreInfo } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.imageStack}>
        <Image source={image} resizeMode="contain" style={styles.image} />
        <View style={styles.rect}>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.title}>{name}</Text>
              <View style={styles.image3Row}>
                <Image source={require('@/assets/images/icon.png')} resizeMode="contain" style={styles.image3} />
                <Text style={styles.origin}>Mango, Apple, Orange</Text>
              </View>
            </View>
            <Image source={require('@/assets/images/eel_icon.png')} resizeMode="contain" style={styles.image2} />
          </View>
          <View style={styles.rect2}>
            <View style={styles.image4Row}>
              <Image source={require('@/assets/images/icon.png')} resizeMode="contain" style={styles.image4} />
              <Text style={styles.detailText}>Needs Attention</Text>
              <Image source={require('@/assets/images/icon.png')} resizeMode="contain" style={styles.image5} />
              <Text style={styles.detailText}>Regular Monitoring</Text>
            </View>
          </View>
          <View style={styles.rect3}>
            <Text style={styles.sectionTitle}>What is it?</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.moreInfo}>{moreInfo}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DiseaseDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 482,
    height: 315,
  },
  rect: {
    top: 249,
    left: 61,
    width: 360,
    height: 469,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 27,
  },
  title: {
    fontFamily: 'comicneuebold',
    color: '#121212',
    fontSize: 20,
  },
  floatTxt: {
    top: 3,
    left: 4,
    color: 'white',
    fontFamily: 'comicneuebold',
  },
  floatBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    position: 'absolute',
    bottom: 20,
    right: 15,
    height: 45,
    backgroundColor: '#195F57',
    borderRadius: 27,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 1, height: 1 },
    elevation: 7,
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  image3: {
    width: 21,
    height: 15,
  },
  origin: {
    fontFamily: 'comicneuebold',
    color: '#121212',
    marginLeft: 3,
  },
  image3Row: {
    flexDirection: 'row',
    marginTop: 9,
    marginRight: 35,
  },
  titleColumn: {
    width: 159,
  },
  image2: {
    width: 59,
    height: 46,
    marginLeft: 111,
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 16,
    marginRight: 15,
  },
  rect2: {
    width: 326,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    marginTop: 13,
    marginLeft: 18,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 1, height: 1 },
    elevation: 5,
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  image4: {
    width: 20,
    height: 20,
  },
  detailText: {
    fontFamily: 'comicneuebold',
    color: '#121212',
    marginLeft: 7,
    marginTop: 2,
  },
  image5: {
    width: 25,
    height: 20,
    marginLeft: 69,
  },
  image4Row: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 20,
    marginLeft: 12,
    marginTop: 15,
  },
  rect3: {
    width: 326,
    height: 202,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 30,
    marginLeft: 18,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 1, height: 1 },
    elevation: 5,
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  description: {
    fontFamily: 'comicneueregular',
    color: '#121212',
    width: 315,
    height: 176,
    textAlign: 'justify',
    marginTop: 30,
    marginLeft: 6,
  },
  sectionTitle: {
    fontFamily: 'comicneuebold',
    color: '#121212',
    textAlign: 'justify',
    fontSize: 15,
    top: 10,
    marginLeft: 6,
  },
  moreInfo: {
    fontFamily: 'comicneueregular',
    color: '#121212',
    textAlign: 'justify',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 6,
  },
  imageStack: {
    width: 482,
    height: 718,
    marginTop: -16,
    marginLeft: -61,
  },
});
