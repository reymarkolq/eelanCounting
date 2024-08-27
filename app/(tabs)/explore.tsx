import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

export default function TabTwoScreen() {
  const navigation = useNavigation();

  function handlePress(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
     <View style={styles.container}>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Eel Fish Diseases</Text>
          <Text style={styles.mainButtonSubtitle}>Browse through eel diseases</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => handlePress('Skin Lesion')}
        >
          <Image style={styles.icon} source={require('@/assets/images/eel photo.jpg')} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionButtonText}>Skin Lesion</Text>
            <Text style={styles.optionButtonSubText}>Mango, Apple, Orange</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => handlePress('Behavior')}
        >
          <Image style={styles.icon} source={require('@/assets/images/eel photo.jpg')} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionButtonText}>Behavior</Text>
            <Text style={styles.optionButtonSubText}>Mango, Apple, Orange</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black"/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton} 
          onPress={() => handlePress('Color of Eyes')}
        >
          <Image style={styles.icon} source={require('@/assets/images/eel photo.jpg')} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionButtonText}>Color of Eyes</Text>
            <Text style={styles.optionButtonSubText}>Mango, Apple, Orange</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  mainContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: '#E0E0E0',
    padding: 40,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    width: '80%',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainButtonSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 45,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
  },
  optionTextContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    flex: 1,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButtonSubText: {
    fontSize: 14,
    color: '#757575',
  },
  icon: {
    width: 40,
    height: 40,
  },
});
