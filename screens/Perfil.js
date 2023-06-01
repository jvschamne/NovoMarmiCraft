import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useState, useContext } from 'react';
import BottomTabNav from '../components/BottomTabNav';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, PermissionStatus, MediaTypeOptions} from 'expo-image-picker';
import Context from '../Context';

export default function Perfil() {
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);

  const [userData, setUserData] = useContext(Context).prop1;
  const userType = useContext(Context).prop2[0];
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
  console.log("TELA PERFIL - userType: ", userType);

  const verifyPermission = async () => {
    if (cameraPermissionInformation.status===PermissionStatus.UNDETERMINED){
        const permissionResponse=await requestPermission();

        return permissionResponse.granted;
    }
    if (cameraPermissionInformation.status===PermissionStatus.DENIED){
        Alert.alert(
            'Insufficient permission!',
            'You need to grant camera access to use this app'
        );
        return false
    }
    return true;
  }


  const takePhoto = async () => {
    const hasPermission = await verifyPermission();
    console.log(hasPermission);
    if (!hasPermission){
        return;
    }

    // No permissions request is necessary for launching the image library
    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    setImage(result.assets[0].uri);
  };
  

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  const saveChanges = async () => {
    
    
    setEdit(false);
  }

  if(!edit){
    return (
        <View style={styles.container}>

          
          
          <Text style={styles.title}>{userData["nome"]}</Text>

          <Image source={require('../assets/profile-icon.png')} style={styles.image} />
          
          <TouchableOpacity style={styles.button} onPress={() => setEdit(true)}>
            <Text style={styles.buttonText}>EDITAR PERFIL</Text>
          </TouchableOpacity>
    
          <StatusBar style="auto" />
          <BottomTabNav></BottomTabNav>

        </View>
    );
  }

  else{
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.image} />

        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text>Tirar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text>Galeria</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={saveChanges}>
          <Text style={styles.buttonText}>SALVAR</Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
        <BottomTabNav></BottomTabNav>
      </View>
    );
  }


}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcc40d',
    },
    title: {
        fontWeight: 'bold',
        marginTop: 30,
        fontSize: 30,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center'
    },
    photoButton: {
      marginTop: 20,
      backgroundColor: 'white',
      width: 140,
      height: 30,
      borderRadius: 10,
      justifyContent:'center',
      alignItems: 'center'
    },
    galleryButton: {
      marginTop: 20,
      backgroundColor: 'white',
      width: 140,
      height: 30,
      borderRadius: 10,
      justifyContent:'center',
      alignItems: 'center'
    },
    image: {
      padding: 130,
      borderColor: 'white',
      borderWidth: 8,
      width: 200,
      height: 200,
      backgroundColor: 'white',
      borderRadius: 2000
    }, 
    button: {
      backgroundColor: 'black',
      padding: 15,
      width: 200,
      justifyContent: 'center', 
      alignItems:'center',
      borderRadius: 30,
      marginTop: 32,
    },
    buttonText: {
      color: '#fcc40d',
      fontWeight: 'bold',
      fontSize: 16,
    },
})