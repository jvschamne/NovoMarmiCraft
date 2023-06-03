import { StyleSheet, Text, View, TextInput, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState, useContext } from 'react';
import BottomTabNav from '../components/BottomTabNav';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, PermissionStatus, MediaTypeOptions} from 'expo-image-picker';
import Context from '../Context';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, getCollection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import app from '../config/firebase';
import PlateCard from '../components/PlateCard';


export default function Perfil() {
  const db = getFirestore(app);
  const storage = getStorage();
  
  const userType = useContext(Context).type[0];
  const uId = useContext(Context).id[0];

  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);

  const [userData, setUserData] = useContext(Context).data;
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
  console.log("TELA PERFIL - userType: ", userType);

  const [name, setName] = useState(userData["nome"]);
  const [email, setEmail] = useState(userData["e-mail"]);
  const [neighbourhood, setNeighbourhood] = useState(userData["bairro"]);
  const [street, setStreet] = useState(userData["rua"]);
  const [number, setNumber] = useState(userData["numero"]);
  const [telefone, setTelefone] = useState(userData["telefone"]);

  

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

  const checkMenu = async () => {
    const colRef = collection(db, "menu "+userData["nome"]);
    const colSnap = await getCollection(colRef);

    if(colSnap.exists()){
      console.log("Document data:", colSnap.data());
    }
    else{
      console.log("No such document!");
    }
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


  // Salva mudanças feitas pelo usuário ao seu perfil
  const saveChanges = async () => {
    const userDocRef = doc(db, userType, uId);

    /* TODO
    if(image!==null){
      
    }
    */

    await updateDoc(userDocRef, {
      "bairro": neighbourhood,
      "nome": name, 
      "numero": number,
      "rua": street,
      "telefone": telefone,
      "image": image
    });

    const docSnapUser = await getDoc(userDocRef);
    if (docSnapUser.exists()) {
      setUserData(docSnapUser.data());
    }

    setEdit(false);
  }


  
  // Caso não esteja no modo de edição
  if(!edit){
    if(userType === "clientes"){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData["nome"]}</Text>

            <Image source={require('../assets/profile-icon.png')} style={styles.image} />

            <Text style={styles.normalText}>{userData["bairro"]}</Text>
            <Text style={styles.normalText}>{userData["rua"]}, {userData["numero"]}</Text>
            <Text style={styles.normalText}>{userData["telefone"]}</Text>

            <TouchableOpacity style={styles.button} onPress={() => setEdit(true)}>
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

          </ScrollView>


    
          <StatusBar style="auto" />
          <BottomTabNav></BottomTabNav>

        </View>
      );
    }
    else if(userType === "restaurantes"){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData["nome"]}</Text>

            <Image source={require('../assets/profile-icon.png')} style={styles.image} />

            <Text style={styles.normalText}>{userData["bairro"]}</Text>
            <Text style={styles.normalText}>{userData["rua"]}, {userData["numero"]}</Text>
            <Text style={styles.normalText}>{userData["telefone"]}</Text>

            <View style={styles.menu}>
              
              <TouchableOpacity style={styles.menuItemButton}>
                <PlateCard style={styles.menuItem} data={{"nome" : "prato"}}/>
              </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.button} onPress={() => setEdit(true)}>
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

          </ScrollView>


    
          <StatusBar style="auto" />
          <BottomTabNav></BottomTabNav>

        </View>
      );
    }
  }

  // Caso esteja no modo de edição
  else{
    if(userType === "clientes"){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              onChangeText={text => setName(text)}
              value={name}
            />
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              onChangeText={text => setNeighbourhood(text)}
              value={neighbourhood}
            />
            <TextInput
              style={styles.input}
              placeholder="Rua"
              onChangeText={text => setStreet(text)}
              value={street}
            />
            <TextInput
              style={styles.input}
              placeholder="Número"
              onChangeText={text => setNumber(text)}
              value={number}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone (DD XXXXX-XXXX) "
              onChangeText={text => setTelefone(text)}
              value={telefone}
            />

            <TouchableOpacity style={styles.button} onPress={saveChanges}>
              <Text style={styles.buttonText}>SALVAR</Text>
            </TouchableOpacity>
          
          </ScrollView>


          <StatusBar style="auto" />
          <BottomTabNav style={styles.bottomBar}></BottomTabNav>
          
        </View>
      );
    }
    else if(userType === "restaurantes"){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>

            <View style={styles.menu}>
              
              <TouchableOpacity style={styles.menuItemButton}>
                <PlateCard style={styles.menuItem} data={{"nome" : "prato"}} cardType="add"/>
              </TouchableOpacity>

            </View>


            <TouchableOpacity style={styles.button} onPress={saveChanges}>
              <Text style={styles.buttonText}>SALVAR</Text>
            </TouchableOpacity>
          
          </ScrollView>


          <StatusBar style="auto" />
          <BottomTabNav style={styles.bottomBar}></BottomTabNav>
          
        </View>
      );
    }
  }


}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingTop: 50,
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#fcc40d',
    },
    scrollView: {
      width: '100%',
    },
    title: {
      alignSelf: 'center',
      fontWeight: 'bold',
      marginTop: 30,
      fontSize: 30,
      marginBottom: 20,
      width: '80%',
      textAlign: 'center'
    },
    normalText: {
      marginTop: 5,
      marginLeft: 20,
      fontSize: 25,
      marginBottom: 5,
      width: '80%',
      textAlign: 'left'
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
      marginBottom: 20,
      backgroundColor: 'white',
      width: 140,
      height: 30,
      borderRadius: 10,
      justifyContent:'center',
      alignItems: 'center'
    },
    image: {
      alignSelf: 'center',
      padding: 130,
      borderColor: 'white',
      marginBottom: 10,
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
      alignSelf:'center',
      borderRadius: 30,
      marginTop: 32,
      marginBottom: '30%'
    },
    buttonText: {
      color: '#fcc40d',
      fontWeight: 'bold',
      fontSize: 16,
    },
    menu: {
      marginTop: 10,
      paddingTop: 40,
      paddingBottom: 40,
      backgroundColor: 'gray',
      width: '100%',
    },
    menuItemButton: {
      width: '100%',
      alignItems: 'center',
    },
    menuItem: {
      backgroundColor: 'white',
      width: '90%',
      alignItems: 'baseline',
      borderColor: 'black',
      marginTop: 20,
      borderWidth: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#000',
      backgroundColor: '#fff',
      borderRadius: 15,
      padding: 8,
      marginTop: 15,
      margin: 8,
      width: '80%',
    },
})