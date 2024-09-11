import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';

type exploreRouteProp = RouteProp<RootStackParamList, 'explore'>;

type Props = {
  route: exploreRouteProp;
};

export default function ExploreScreen({ route }: Props) {
  const { photo, count } = route?.params || {photo: {uri: ''}, count: null};  // Retrieve photo and count from route params
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'camera'>>();  // Navigation hook

  const handleRetakePhoto = () => {
    // Navigate back to the Camera screen for retaking the photo
    navigation.navigate('camera', {});
  };

  const pickImageFromGallery = () => {
    // Navigate back to Camera screen but prompt for gallery image selection
    navigation.navigate('camera', { gallery: true });
  };

  return (
    <View style={styles.container}>
      {/* Display the captured image */}
      <Image
        source={{ uri: photo.uri }}
        style={styles.imagePreview}
        resizeMode='contain'
      />
      
      {/* Show the Eel Count result */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Eels Counted: {count !== null ? count : 'Calculating...'}
        </Text>
      </View>

      {/* Buttons for retaking photo or selecting another image */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
          <AntDesign name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Retake Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickImageFromGallery}>
          <AntDesign name="picture" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
