import { StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function DiseaseDetectionScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Disease Detection</ThemedText>
      {/* Display detection results here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
