import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator'; // to manipulate frames
import * as tf from '@tensorflow/tfjs'; // TensorFlow.js
import * as jpeg from 'jpeg-js'; // to decode jpeg images
import { Svg, Path } from 'react-native-svg'; // For drawing bounding boxes
import { fetch } from '@tensorflow/tfjs-react-native'; // Import TensorFlow's fetch for React Native
import {GestureResponderEvent } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);  // Changed to use boolean for permission
  const cameraRef = useRef<Camera | null>(null);
  const [count, setCount] = useState<number | null>(null);  // Holds the eel count
  const [predictions, setPredictions] = useState<any[]>([]); // Holds bounding box predictions
  const [model, setModel] = useState<tf.GraphModel | null>(null);  // Holds the loaded model

  // Request camera permissions when the component mounts
  useEffect(() => {
    (async () => {
      const { status: cameraStatus} = await Camera.requestCameraPermissionsAsync();
      const { status: microphoneStatus } = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && microphoneStatus === 'granted');
    })();
  }, []);

  // Load the YOLO model when the component is mounted
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load the pre-trained YOLOv8 model hosted on your server
        const model = await tf.loadGraphModel('https://your-model-url/model.json');
        setModel(model);  // Set the model state
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
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true, // Skip any post-processing for perfromance
        });

        // Optionally compress the image to improve performance
        const compressedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }], // Resize image for faster processing
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Run eel counting and detection
        const eelCount = await countEels(compressedImage.uri);
        setCount(eelCount); // Update the eel count state
        
        console.log('Photo captured and compressed:', compressedImage);
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
      const rawImageData = jpeg.decode(imageData, {useTArray: true});
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

  // Function to classify whether an eel is active or non-active based on predictions
  const classifyEel = (prediction: any) => {
    // Placeholder logic to classify eels as active or non-active
    // You can replace this with your actual logic
    // Example: classify as active if width > a threshold, otherwise non-active
    return prediction.width > 100; // Just an example threshold
  };

  // Function to extract bounding boxes from model predictions
  const extractBoundingBoxes = (predictions: any[]) => {
    const boxes: any[] = [];
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox; // Replace with your model's output format
      boxes.push({ x, y, width, height });
    });
    return boxes;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame(); // Capture frame every second (or chosen interval)
    }, 1000); // 1 second interval

    return () => clearInterval(interval); // Cleanup the interval when the component is unmounted
  }, [model]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button title="Grant permission" onPress={() => Camera.requestCameraPermissionsAsync()} />
      </View>
    );
  }


  // Toggle front/back camera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Function to render bounding boxes over the camera feed with colors based on activity
  const renderBoundingBoxes = () => {
    return predictions.map((prediction, index) => {
      const isActive = prediction.isActive; // Determine if the eel is active
      const boxColor = isActive ? 'green' : 'red'; // Green for active eels, Red for non-active eels
    
      return (
        <Path
          key={index}
          d={`M${prediction.x},${prediction.y} L${prediction.x + prediction.width},${prediction.y} 
            L${prediction.x + prediction.width},${prediction.y + prediction.height} 
            L${prediction.x},${prediction.y + prediction.height} Z`}
          stroke={boxColor} // Use the dynamic color
          strokeWidth={2}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {hasPermission && (
      <Camera style={styles.camera} type={facing === 'front' ? Camera.Constants.Type.front : Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Toggle Camera Facing */}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
        </View>

        {/* Render bounding boxes */}
        <Svg style={styles.canvas}>
          {predictions && renderBoundingBoxes()}
        </Svg>

        {/* Display live eel count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Eel Count: {count !== null ? count : 'Detecting...'}</Text>
        </View>
        </Camera>
      )}
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
