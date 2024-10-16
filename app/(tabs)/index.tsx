import { Image, StyleSheet, TouchableOpacity, View, Pressable, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';
import { useFonts } from 'expo-font';

// Get deive dimensions
const { width, height } = Dimensions.get('window');

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
          Eel Counting helps track eel populations in real time by counting eels automatically.
        </ThemedText>
      </ThemedView>

      {/* Action Section */}
      <ThemedView style={styles.actionContainer}>
        <ThemedText style={styles.subtitle}>Count Eels Instantly!</ThemedText>
        <View style={styles.imagesRow}>
          {/* Image Section */}
          <Image
            source={require('@/assets/images/real-time-cam.png')}
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
            source={require('@/assets/images/counting-graph.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/right-arrow_icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/results.png')}
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
    padding: height * 0.02, // Padding based on screen height
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
    width: width * 0.5, // 50% of screen width
    height: height * 0.2, // 20% of screen height
  },
  welcomeInnerContainer: {
    padding: height * 0.03, // Dynamic padding
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  welcomeOuterContainer: {
    padding: width * 0.1, // Dynamic padding based on screen width
    backgroundColor: '#FFFFFF',
    margin: width * 0.05, // Dynamic margin based on screen width
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: width * 0.05, // Responsive font size based on screen width
    fontFamily: 'RobotoMono-Regular',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: height * 0.02,
    fontSize: width * 0.045, // Adjusted font size for subtitle
    fontFamily: 'RobotoMono-Regular',  
    color: '#333',
    textAlign: 'center',
  },
  description: {
    marginTop: height * 0.015,
    fontSize: width * 0.04,
    fontFamily: 'RobotoMono-Regular', 
    color: '#555',
    lineHeight: width * 0.05, // Line height based on width for better readability
    textAlign: 'center',
  },
  actionContainer: {
    padding: height * 0.03,
    backgroundColor: '#FFFFFF',
    margin: width * 0.05,
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
    paddingVertical: height * 0.02, // Dynamic vertical padding
    paddingHorizontal: width * 0.05, // Dynamic horizontal padding
    borderRadius: 8,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    marginLeft: width * 0.02, // Adjusted margin for better spacing
    fontSize: width * 0.041, // Responsive font size
    fontFamily: 'RobotoMono-Regular',  
    color: '#FFFFFF',
  },
  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: height * 0.03, // Dynamic margin
    width: '100%',
  },
  icon: {
    width: width * 0.1, // Icon size responsive to screen width
    height: height * 0.05, // Icon size responsive to screen height
  },
});
