import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Svg, Path, Line, Text as SvgText, Rect } from 'react-native-svg';
import TFLite from 'react-native-tflite'; 
import * as jpeg from 'jpeg-js';
import { Asset } from 'expo-asset';
import ImageResizer from 'react-native-image-resizer';  // Import ImageResizer

const { width, height } = Dimensions.get('window');
const LINE_POSITION_X = width / 2; // Vertical line at the middle of the screen

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [model, setModel] = useState(null); // Holds the loaded TFLite model
  const [eelInCount, setEelInCount] = useState(0); // Counter for "in"
  const [eelOutCount, setEelOutCount] = useState(0); // Counter for "out"
  const [previousPositions, setPreviousPositions] = useState<any[]>([]); // Store previous positions of eels for movement tracking

  // Load the TFLite model when the component is mounted
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Initializing TFLite...');
        const modelAsset = Asset.fromModule(require('../assets/models/yolov8m_float16.tflite')); // Correct path to the model
        await modelAsset.downloadAsync();  // Download the model file to the device
        console.log('Model path:', modelAsset.localUri);

        if (TFLite && TFLite.loadModel) {
          TFLite.loadModel({
            model: modelAsset.localUri, // Use the localUri to load the model
          }, (err: any, res: any) => {
            if (err) {
              console.error('Error loading model:', err);
              alert('Failed to load model');
            } else {
              console.log('Model loaded successfully');
              setModel(res);
            }
          });
        } else {
          console.error('TFLite not initialized or loadModel not found.');
          alert('TFLite module is not initialized.');
        }
      } catch (error) {
        console.error('Error loading TFLite model:', error);
      }
    };

    loadModel();
  }, []);


  // Function to process each frame in real-time
  const processFrame = async () => {
    if (cameraRef.current && model) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
        if (!photo || !photo.uri) return;

        // Use ImageResizer to resize the captured image to the model's input size
        const resizeImage = await ImageResizer.createResizedImage(
          photo.uri,     // Image URI
          640,           // New width (match model's expected input size)
          640,           // New height (match model's expected input size)
          'JPEG',        // Format
          100            // Quality
        );

        // Preprocess the image for TFLite
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer);
        const rawImageData = jpeg.decode(imageData, { useTArray: true });

        // Run the model and get predictions
        TFLite.runModel({
          input: rawImageData.data, // raw pixel data
          inputShape: [1, 640, 640, 3], // Modify based on your model's input shape
        }, (err: any, res: any) => {
          if (err) {
            console.error('Error running model:', err);
          } else {
            console.log('Model results:', res); // Log the raw model results
            const eelBoxes = extractBoundingBoxes(res); // Adjust based on actual result format
            setPredictions(eelBoxes); // Update bounding boxes for rendering
            setCount(eelBoxes.length); // Update the eel count
            trackEelMovement(eelBoxes); // Track eel movement across the line
          }
        });
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    }
  };

  // Function to track eels crossing the line (in/out)
  const [previousTimestamps, setPreviousTimestamps] = useState<number[]>([]); // Initialize an array for previous timestamps
  const trackEelMovement = (eelBoxes: any[]) => {
    const currentTimestamp = Date.now();
    eelBoxes.forEach((eel, index) => {
      const previousPosition = previousPositions[index];
      const previousTimestamp = previousTimestamps[index];

      if (previousPosition && previousTimestamp) {
        const distance = Math.abs(eel.x - previousPosition.x);
        const timeElapsed = (currentTimestamp - previousTimestamp) / 1000; 
        const speed = distance / timeElapsed; 

        // Classify based on speed
        if (speed > 0.60 && speed <= 0.90) { 
          eel.isActive = 'active';
        } else {
          eel.isActive = 'inactive';
        }

        // Eel crossing from left to right (out)
        if (previousPosition < LINE_POSITION_X && eel.x > LINE_POSITION_X) {
          setEelOutCount(eelOutCount + 1);
        }
        // Eel crossing right to left (in)
        if (previousPosition > LINE_POSITION_X && eel.x < LINE_POSITION_X) {
          setEelInCount(eelInCount + 1);
        }
      }
    });
    setPreviousPositions(eelBoxes); // Update the previous positions of the eels
    setPreviousTimestamps(Array(eelBoxes.length).fill(Date.now()));
  };

  // Function to extract bounding boxes from model predictions
  const extractBoundingBoxes = (predictions: any[]) => {
    console.log('Predictions:', predictions); // Check the structure of predictions
    return predictions.map(prediction => {
      const [x, y, width, height] = prediction.bbox || [0, 0, 0, 0]; // Check for bbox key
      return { x, y, width, height, isActive: 'inactive' };
    });
  };

  // Function to render bounding boxes and labels over the camera feed
  const renderBoundingBoxes = () => {
    return predictions.map((prediction, index) => {
      const boxColor = prediction.isActive === 'active' ? 'green' : 'red'; // Green for active eels, Red for inactive eels
      return (
        <Svg key={index}>
          <Path
            d={`M${prediction.x},${prediction.y} L${prediction.x + prediction.width},${prediction.y} 
               L${prediction.x + prediction.width},${prediction.y + prediction.height} 
               L${prediction.x},${prediction.y + prediction.height} Z`}
            stroke={boxColor}
            strokeWidth={2}
          />
          <SvgText
            x={prediction.x}
            y={prediction.y - 5}
            fill="yellow"
            fontSize="12"
            fontWeight="bold"
          >
            {`Eel ${prediction.isActive ? 'Active' : 'Inactive'}`}
          </SvgText>
        </Svg>
      );
    });
  };

  // Start real-time processing when the camera is ready
  const handleCameraReady = async () => {
    setInterval(() => processFrame(), 500); // Run every 500ms
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

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} onCameraReady={handleCameraReady}>
        <Svg style={styles.canvas}>
          {predictions && renderBoundingBoxes()}
          {/* Vertical line */}
          <Line x1={LINE_POSITION_X} y1="0" x2={LINE_POSITION_X} y2={height} stroke="white" strokeWidth="2" />

          {/* In/Out Counter in the middle of the vertical line */}
          <Rect x={LINE_POSITION_X - 40} y={height / 2 - 30} width="80" height="60" fill="white" />
          <SvgText x={LINE_POSITION_X - 35} y={height / 2 - 10} fill="black" fontSize="18" fontWeight="bold">
            {`In: ${eelInCount}`}
          </SvgText>
          <SvgText x={LINE_POSITION_X - 35} y={height / 2 + 20} fill="black" fontSize="18" fontWeight="bold">
            {`Out: ${eelOutCount}`}
          </SvgText>
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

