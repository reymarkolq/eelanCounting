import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator'; // to manipulate frames
import { AntDesign } from '@expo/vector-icons';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [count, setCount] = useState<number | null>(null);  // Holds the eel count

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame(); // Capture frame every second (or chosen interval)
    }, 1000); // 1 second interval

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  // Toggle front/back camera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Capture the frame from the camera and count the eels
  const captureFrame = async () => {
    if (cameraRef.current) {
      try {
        // Capture the frame as an image
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
        });

        // Optionally compress the image to improve performance
        const compressedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }], // Resize image for faster processing
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Call eel counting function to process the image
        const eelCount = await countEels(compressedImage.uri);

        // Update the count state with the result
        setCount(eelCount);
      } catch (error) {
        console.error("Error capturing frame:", error);
      }
    }
  };

  // Example eel counting function (replace with actual implementation)
  const countEels = async (imageUri: string) => {
    // This is where you'd implement the logic to count eels from the image
    // For now, we'll mock this with a random number
    return Math.floor(Math.random() * 10); // Mock count
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Toggle Camera Facing */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Display live eel count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Eel Count: {count !== null ? count : 'Detecting...'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    padding: 20,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  countContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
