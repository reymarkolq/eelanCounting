import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { Button, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Svg, Path, Line, Text as SvgText, Rect } from 'react-native-svg';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import * as jpeg from 'jpeg-js';
import ImageResizer from 'react-native-image-resizer';  // Import ImageResizer

const { width, height } = Dimensions.get('window');
const LINE_POSITION_X = width / 2; // Vertical line at the middle of the screen

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [model, setModel] = useState<InferenceSession | null>(null); // Holds the loaded ONNX model
  const [eelInCount, setEelInCount] = useState(0); // Counter for "in"
  const [eelOutCount, setEelOutCount] = useState(0); // Counter for "out"
  const [previousPositions, setPreviousPositions] = useState<any[]>([]); // Store previous positions of eels for movement tracking

   // Load the TFLite model when the component is mounted
  useEffect(() => {
    const loadModel = async () => {
      try {
        const session = await InferenceSession.create('C:/Users/reymarkoliquino/pers-app/EELANCOUNTING/eeldiseasedetector/assets/models/yolov8m.onnx'); // Load the ONNX model
        setModel(session);
        console.log('ONNX model loaded successfully');
      } catch (error) {
        console.error('Error loading ONNX model:', error);
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
        const resizedImage = await ImageResizer.createResizedImage(
          photo.uri,     // Image URI
          640,           // New width (match model's expected input size)
          640,           // New height (match model's expected input size)
          'JPEG',        // Format
          100            // Quality
        );

        // Preprocess the image
        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer);
        const rawImageData = jpeg.decode(imageData, { useTArray: true });

        // Convert the raw image data into a tensor
        const tensor = new Tensor('float32', Float32Array.from(rawImageData.data), [1, 3, 640, 640]);

        // Run the ONNX model and get predictions
        const feeds = { input: tensor };
        const results = await model.run(feeds);

        // Log the entire results object to understand its structure
        console.log('Model output:', results);

        const output = results.output.data; // Assuming the model's output key is "output"
        
        // Log the raw model results
        console.log('Model results:', output);

  
        const eelBoxes = extractBoundingBoxes(output); // Adjust based on actual result format
        setPredictions(eelBoxes); // Update bounding boxes for rendering
        setCount(eelBoxes.length); // Update the eel count
        trackEelMovement(eelBoxes); // Track eel movement across the line
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

  // Function to extract bounding boxes from model predictions
  const extractBoundingBoxes = (output: any): any[] => {
    // Handle different output formats based on inspection
    if (Array.isArray(output)) {
        console.log('Processing array output');
        const predictions = [];
        for (let i = 0; i < output.length; i += 5) {  // Assuming each box has 5 values
            predictions.push({
                x: output[i],
                y: output[i + 1],
                width: output[i + 2],
                height: output[i + 3],
                score: output[i + 4]
            });
        }
        return predictions;
    } else if (output instanceof Float32Array || output instanceof Uint8Array) {
        console.log('Processing typed array output');
        const predictions = [];
        for (let i = 0; i < output.length; i += 5) {
            predictions.push({
                x: output[i],
                y: output[i + 1],
                width: output[i + 2],
                height: output[i + 3],
                score: output[i + 4]
            });
        }
        return predictions;
    } else {
        console.error('Unexpected output type:', output);
        return [];
    }
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

