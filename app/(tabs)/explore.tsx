import { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';

type ExploreRouteProp = RouteProp<RootStackParamList, 'explore'>;

type Props = {
  route: ExploreRouteProp;
};

export default function ExploreScreen({ route }: Props) {
  const { eelInCount, eelOutCount } = route?.params || { 
    eelInCount: 0, 
    eelOutCount: 0 
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList, 'camera'>>();

  const totalEels = eelInCount + eelOutCount;

  // Automatic scroll logic
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    require('../../assets/images/glasseel1.jpg'),
    require('../../assets/images/glasseel2.jpg'),
    require('../../assets/images/glasseel3.jpg'),
    require('../../assets/images/glasseel4.jpg'),
    require('../../assets/images/glasseel5.jpg')
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (currentIndex + 1) % images.length;
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const handleRetakePhoto = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {images.map((image, index) => (
            <Image key={index} source={image} style={styles.image} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.title}>Eel Counting Results</Text>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Total Eels Detected: <Text style={styles.highlight}>{totalEels}</Text></Text>
        <Text style={styles.countText}>Active Eels: <Text style={styles.highlight}>{eelInCount}</Text></Text>
        <Text style={styles.countText}>Inactive Eels: <Text style={styles.highlight}>{eelOutCount}</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
        <AntDesign name="camera" size={24} color="white" />
        <Text style={styles.buttonText}>ReCount</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,  // Adjusted the height to match the design
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,  // Full-width images with some margin
    height: 200,
    borderRadius: 15,
    marginHorizontal: 10,  // Space between images in the horizontal scroll
    borderWidth: 2,
    borderColor: '#008000',
  },
  title: {
    fontSize: 28,
    fontFamily: 'RobotoMono-Regular',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  countContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  countText: {
    fontSize: 18,
    fontFamily: 'RobotoMono-Regular',
    color: '#555',
    marginVertical: 5,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#388E3C',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'RobotoMono-Regular',
    color: '#FFFFFF',
  },
});
