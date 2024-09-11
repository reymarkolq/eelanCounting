import { Image, StyleSheet, TouchableOpacity, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';
import { useFonts } from 'expo-font';

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'camera'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Hook to use navigation

  const [fontsLoaded] = useFonts({
    'VastShadow-Regular': require('@/assets/fonts/VastShadow-Regular.ttf'),
    'RobotoMono-Regular': require('@/assets/fonts/RobotoMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Show a loading screen or nothing until fonts are loaded
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header Section */}
      <ThemedView style={styles.header}>
        <Image
          source={require('@/assets/images/eelan-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </ThemedView>

      {/* Welcome Section */}
      <ThemedView style={styles.welcomeOuterContainer}>
        <ThemedView style={styles.welcomeInnerContainer}>
          <ThemedText style={styles.welcomeText}>Hi! Welcome to Eelan App</ThemedText>
        </ThemedView>
        <ThemedText style={styles.subtitle}>What is Eelan App?</ThemedText>
        <ThemedText style={styles.description}>
          Eel Counting helps track eel populations in real time by capturing images and counting eels automatically.
        </ThemedText>
      </ThemedView>

      {/* Action Section */}
      <ThemedView style={styles.actionContainer}>
        <ThemedText style={styles.subtitle}>Count Eels Instantly!</ThemedText>
        <View style={styles.imagesRow}>
          {/* Image Section */}
          <Image
            source={require('@/assets/images/recording-camera.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/right-arrow_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/eel_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/right-arrow_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/counter.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Pressable Button for better feedback */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? '#006400' : '#008000' }, // Change color when pressed
          ]}
          onPress={() => navigation.navigate('camera', {})}
        >
          <Icon name="camera-outline" size={24} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Count Eels</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF5EA',
  },
  header: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#008000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    width: 200,
    height: 200,
  },
  welcomeInnerContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  welcomeOuterContainer: {
    padding: 35,
    backgroundColor: '#FFFFFF',
    margin: 25,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: 'RobotoMono-Regular',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: 'RobotoMono-Regular',  
    color: '#333',
    textAlign: 'center',
  },
  description: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'RobotoMono-Regular', 
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
  },
  actionContainer: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'RobotoMono-Regular',  
    color: '#FFFFFF',
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
