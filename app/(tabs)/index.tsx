import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native'; // Import this to use navigation
import { RootStackParamList } from '@/components/navigation/types'; // Ensure the import path is correct

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'camera'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Hook to use navigation

  return (
    <ThemedView style={styles.container}>
      {/* Header Section */}
      <ThemedView style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')} // Replace with your logo image
          style={styles.logo}
          resizeMode='contain'
        />
        <ThemedText style={styles.title}>Eel Detector</ThemedText>
      </ThemedView>

      {/* Welcome Section */}
      <ThemedView style={styles.welcomeOuterContainer}>
        <ThemedView style={styles.welcomeInnerContainer}>
           <ThemedText style={styles.welcomeText}>Hi! Welcome to Eel Detector</ThemedText>
        </ThemedView>
        <ThemedText style={styles.subtitle}>What is Eel Detector?</ThemedText>
        <ThemedText style={styles.description}>
          An eel detector is a system used to track eels in aquatic environments using sensors or
          imaging technologies, crucial for scientific study and environmental monitoring,
          assessing eel populations and behavior.
        </ThemedText>
      </ThemedView>

      {/* Action Section */}
      <ThemedView style={styles.actionContainer}>
        <ThemedText style={styles.subtitle}>Heal your Eel Fish!</ThemedText>
        <View style={styles.imagesRow}>
          {/* Image Section */}
        <Image
          source={require('@/assets/images/qr-code-scan_icon.png')}
          style={styles.icon}
          resizeMode='contain'
          />
          <Image
          source={require('@/assets/images/right-arrow_icon.png')}
          style={styles.icon}
          resizeMode='contain'
        />
        <Image
          source={require('@/assets/images/documents_icon.png')}
          style={styles.icon}
          resizeMode='contain'
          />
          <Image
          source={require('@/assets/images/right-arrow_icon.png')}
          style={styles.icon}
          resizeMode='contain'
        />
        <Image
          source={require('@/assets/images/eel_icon.png')}
          style={styles.icon}
          resizeMode='contain'
        />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('camera')}>
          <Icon name="camera-outline" size={24} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Take a Picture</ThemedText>
        </TouchableOpacity>
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
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#008000',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
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
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  description: {
    marginTop: 15,
    fontSize: 16,
    color: '#555555',
    lineHeight: 22,
  },
  actionContainer: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#CCCCCC',
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
