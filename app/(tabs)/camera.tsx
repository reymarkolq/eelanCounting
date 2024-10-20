import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Svg, Path, Line, Text as SvgText, Rect } from 'react-native-svg';
import TFLite from 'react-native-tflite'; 
import * as jpeg from 'jpeg-js';
import { Asset } from 'expo-asset';
import ImageResizer from 'react-native-image-resizer';

const { width, height } = Dimensions.get('window');
const LINE_POSITION_X = width / 2; // Vertical line at the middle of the screen
let frameCounter = 0; // Used for frame skipping

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [activeEels, setActiveEels] = useState<number>(0);
  const [inactiveEels, setInactiveEels] = useState<number>(0);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [eelInCount, setEelInCount] = useState(0);
  const [eelOutCount, setEelOutCount] = useState(0);
  const [previousPositions, setPreviousPositions] = useState<any[]>([]);

  // Load the TensorFlow Lite model when the component is mounted
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelAsset = Asset.fromModule(require('../../assets/models/best_float16.tflite'));
        await modelAsset.downloadAsync();

        if (TFLite && TFLite.loadModel) {
          TFLite.loadModel({
            model: modelAsset.localUri, 
          }, (err: any, res: any) => {
            if (err) {
              console.error('Error loading model:', err);
            } else {
              setModelLoaded(true);
              console.log('Model loaded successfully');
            }
          });
        }
      } catch (error) {
        console.error('Error loading TFLite model:', error);
      }
    };
    loadModel();
  }, []);

  // Function to process each frame in real-time
  const processFrame = async () => {
    if (cameraRef.current && modelLoaded) {
      frameCounter++;
      
      // Skip frames to reduce load (process every 5th frame)
      if (frameCounter % 5 !== 0) return;

      try {
        const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });

        if (!photo || !photo.uri) {
          console.error('Failed to capture photo or missing photo URI');
          return;
        }

        // Resize the captured image to fit the model's input requirements (reduced size)
        const resizeImage = await ImageResizer.createResizedImage(
          photo.uri, 640, 640, 'JPEG', 100 // Reduced from 640x640 to 320x320
        );

        const response = await fetch(resizeImage.uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer);
        const rawImageData = jpeg.decode(imageData, { useTArray: true });

        // Run the TensorFlow Lite model with the image
        TFLite.runModel({
          input: rawImageData.data,
          inputShape: [1, 640, 640, 3],  // Adjust input shape
        }, (err: any, res: any) => {
          if (err) {
            console.error('Error running model:', err);
          } else {
            const eelBoxes = extractBoundingBoxes(res);
            setPredictions(eelBoxes);
            setCount(eelBoxes.length);
            trackEelMovement(eelBoxes);

            // Update active and inactive eel counts
            const activeCount = eelBoxes.filter(eel => eel.isActive === 'active').length;
            const inactiveCount = eelBoxes.length - activeCount;
            setActiveEels(activeCount);
            setInactiveEels(inactiveCount);
          }
        });
      } catch (error) {
        console.error('Error capturing or processing frame:', error);
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

  // Extract bounding boxes from model predictions
  const extractBoundingBoxes = (predictions: any[]) => {
    return predictions.map(prediction => {
      const [x, y, width, height] = prediction.bbox || [0, 0, 0, 0];
      return { x, y, width, height, isActive: 'inactive' };
    });
  };

  // Render bounding boxes
  const renderBoundingBoxes = () => {
    return predictions.map((prediction, index) => {
      const boxColor = prediction.isActive === 'active' ? 'green' : 'red';
      return (
        <Svg key={index}>
          <Path
            d={`M${prediction.x},${prediction.y} L${prediction.x + prediction.width},${prediction.y} 
               L${prediction.x + prediction.width},${prediction.y + prediction.height} 
               L${prediction.x},${prediction.y + prediction.height} Z`}
            stroke={boxColor}
            strokeWidth={2}
          />
          <SvgText x={prediction.x} y={prediction.y - 5} fill="yellow" fontSize="12" fontWeight="bold">
            {`Eel ${prediction.isActive ? 'Active' : 'Inactive'}`}
          </SvgText>
        </Svg>
      );
    });
  };

  // Start real-time processing when the camera is ready
  const handleCameraReady = async () => {
    setInterval(() => processFrame(), 500);
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
          <Line x1={LINE_POSITION_X} y1="0" x2={LINE_POSITION_X} y2={height} stroke="white" strokeWidth="2" />
          <Rect x={LINE_POSITION_X - 40} y={height / 2 - 30} width="80" height="60" fill="white" />
          <SvgText x={LINE_POSITION_X - 35} y={height / 2 - 10} fill="black" fontSize="18" fontWeight="bold">
            {`In: ${eelInCount}`}
          </SvgText>
          <SvgText x={LINE_POSITION_X - 35} y={height / 2 + 20} fill="black" fontSize="18" fontWeight="bold">
            {`Out: ${eelOutCount}`}
          </SvgText>
        </Svg>

        {/* Eel counts on the left side */}
        <View style={styles.countsContainer}>
          <Text style={styles.countText}>Total Eels: {count !== null ? count : 'Detecting...'}</Text>
          <Text style={[styles.countText, { color: 'green' }]}>Active Eels: {activeEels}</Text>
          <Text style={[styles.countText, { color: 'red' }]}>Inactive Eels: {inactiveEels}</Text>
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
  countsContainer: {
    position: 'absolute',
    top: 50,
    left: 10, // Positioned on the left side of the screen
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
