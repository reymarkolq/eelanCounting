import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions, GestureResponderEvent } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as tf from '@tensorflow/tfjs';
import * as jpeg from 'jpeg-js';
import { Svg, Path } from 'react-native-svg';
import { fetch } from '@tensorflow/tfjs-react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [model, setModel] = useState<tf.GraphModel | null>(null); // Holds the loaded model

  useEffect(() => {
    (async () => {
      if (permission) {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus === 'granted') {
          // Permissions granted
        }
      }
    })();
  }, [permission]);

  // Load the YOLO model when the component is mounted 
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadGraphModel('https://your-model-url/model.json');
        setModel(model);
        console.log('Model loaded successfully');
      } catch (error) {
        console.error('Error loading model:', error);
        alert('Failed to load model');
      }
    };
    tf.ready().then(loadModel);
  }, []);

  // Function to capture frame and process eel counting
  const captureFrame = async () => {
    if (cameraRef.current && model) {
      try {
        // Capture the frame as an image
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true }); // Skip any post-processing for performance
        
        // Check if the photo was captured successfully
        if (!photo || !photo.uri) {
          console.error('Failed to capture the image.');
          return;
        }
        
        // Skip any post-processing for performance
        const compressedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }], // Resize image for faster processing
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        // Run eel counting and detection
        const eelCount = await countEels(compressedImage.uri);
        setCount(eelCount); // Update the eel count state
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    }
  };

  // Function for eel detection using the YOLO model
  const countEels = async (imageUri: string) => {
    try {
      // Preprocess the image for TensorFlow.js
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const imageData = new Uint8Array(arrayBuffer);
      const rawImageData = jpeg.decode(imageData, { useTArray: true });
      const imageTensor = tf.browser.fromPixels(rawImageData);

      // Run the model and get predictions
      const predictions = await model!.executeAsync(imageTensor) as any[];

      // Process predictions: extract bounding boxes and count eels
      const eelBoxes = extractBoundingBoxes(predictions);
      setPredictions(eelBoxes); // Update bounding boxes for rendering
      return eelBoxes.length; // Return the eel count
    } catch (error) {
      console.error('Error detecting eels:', error);
      return 0;
    }
  };

  // Function to extract bounding boxes from model predictions
  const extractBoundingBoxes = (predictions: any[]) => {
    const boxes: any[] = [];
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox; // Replace with your model's 
      const isActive = classifyEel(prediction); // This line to classify eels
      boxes.push({ x, y, width, height, isActive });
    });
    return boxes;
  };

  // Function to classify whether an eel is active or inactive based on predictions
  const classifyEel = (prediction: any) => {
    const { width, height, confidence } = prediction;

    // Thresholds for classifying an eel as active or inactive
    const activeThresholdWidth = 100;
    const activeThresholdHeight = 50;
    const confidenceThreshold = 0.6;
    return (width > activeThresholdWidth && height > activeThresholdHeight && confidence > confidenceThreshold) ? 'active' : 'inactive';
  };

   // Function to render bounding boxes over the camera feed with colors based on activity
  const renderBoundingBoxes = () => {
    return predictions.map((prediction, index) => {
      const boxColor = prediction.isActive ? 'green' : 'red'; // Green for active eels, Red for inactive eels
      return (
        <Path
          key={index}
          d={`M${prediction.x},${prediction.y} L${prediction.x + prediction.width},${prediction.y} 
             L${prediction.x + prediction.width},${prediction.y + prediction.height} 
             L${prediction.x},${prediction.y + prediction.height} Z`}
          stroke={boxColor}
          strokeWidth={2}
        />
      );
    });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing(event: GestureResponderEvent): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureFrame}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
        <Svg style={styles.canvas}>
          {predictions && renderBoundingBoxes()}
        </Svg>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Eel Count: {count !== null ? count : 'Detecting...'}</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
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
