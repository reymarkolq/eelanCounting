import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }: any, any: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eel Detector</Text>
      <Text style={styles.description}>
        An eel detector is a system used to track eels in aquatic environments using sensors
        engaging technologies, crucial for scientific study and environmental monitoring, assessing eel populations and behavior.
      </Text>
      <Button
        title="Heal your Eel Fish!"
        onPress={() => navigation.navigate('Eel Disease')}
      />
      <Button 
        title="Take a Picture"
        onPress={() => {}}
        style={styles.pictureButtom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  pictureButtom: {
    marginTop: 20,
  },
});

