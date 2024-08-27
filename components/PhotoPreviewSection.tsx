import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react'
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View } from 'react-native';

interface PhotoPreviewProps{
    photo: CameraCapturedPicture | { uri: string }; // Modify to allow a URI string for gallery images
    handleRetakePhoto: () => void;
}

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
}: PhotoPreviewProps) => {
  const imageUri = 'base64' in photo ? 'data:image/jpg;base64,' + photo.base64 : photo.uri;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image
          style={styles.previewConatiner}
          source={{ uri: imageUri }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
          <Fontisto name='trash' size={36} color='black' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewConatiner: {
        width: '95%',
        height: '85%',
        borderRadius: 15
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "center",
        width: '100%',
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default PhotoPreviewSection;