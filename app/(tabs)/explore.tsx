import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/components/navigation/types';

type ExploreScreenNavigationProp = NavigationProp<RootStackParamList, 'Explore'>;

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp >();

  const DiseaseDetail = {
     'Behavior': {
      name: 'Behavioral Issues',
      description: 'Details about Behavioral Issues...',
      image: require('@/assets/images/skin_lesion.png'),
      moreInfo: 'Behavioral issues can indicate stress or illness in the eel...'
    },
    'Skin Lesion': {
      name: 'Skin Lesion',
      description: 'Details about Skin Lesion...',
      image: require('@/assets/images/skin_lesion.png'),
      moreInfo: 'Skin lessions are abnormal growths or areas of skin that are different from the skin around them...'
    },
    'Color of Eyes': {
      name: 'Color of Eyes',
      description: 'Details about Eye Color Issues...',
      image: require('@/assets/images/skin_lesion.png'),
      moreInfo: 'Changes in eye color can indicate various conditions...'
    }
  };

  function handlePress(diseaseType: keyof typeof DiseaseDetail) {
    console.log('Navigating to DiseaseDetail with:', DiseaseDetail[diseaseType]);
    navigation.navigate('DiseaseDetail', DiseaseDetail[diseaseType]);
  }

  return (
     <View style={styles.container}>
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Eel Fish Diseases</Text>
          <Text style={styles.mainButtonSubtitle}>Browse through eel diseases</Text>
        </TouchableOpacity>
        
        {/* Iterate over disease types */}
        {Object.keys(DiseaseDetail).map((diseaseType) => (
          <TouchableOpacity 
            key={diseaseType}
            style={styles.optionButton} 
            onPress={() => handlePress(diseaseType as keyof typeof DiseaseDetail)}
          >
            <Image style={styles.icon} source={DiseaseDetail[diseaseType as keyof typeof DiseaseDetail].image} />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionButtonText}>{DiseaseDetail[diseaseType as keyof typeof DiseaseDetail].name}</Text>
              <Text style={styles.optionButtonSubText}>Mango, Apple, Orange</Text>
            </View>
            <Image source={require('@/assets/images/right-arrow_icon.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008000',
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
    width: 50,
    height: 50,
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
});
