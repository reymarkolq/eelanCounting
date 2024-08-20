import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function EelDiseaseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan Eel Fish</Text>
      <View style={styles.scanBox} />
      <View style={styles.buttonContainer}>
        <Button title="Add Image" onPress={() => {}} />
        <Button title="Go" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanBox: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
