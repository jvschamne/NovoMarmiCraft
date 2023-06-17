import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, setDoc, updateDoc} from 'firebase/firestore';
import { getDownloadURL, deleteObject, listAll, getStorage, uploadBytes, ref } from 'firebase/storage';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, PermissionStatus, MediaTypeOptions} from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para gerar IDs únicos
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation, StackActions } from '@react-navigation/native';
import app from '../config/firebase';
import Context from '../Context';

export default function EditPlate(props) {
    const plate = props.route.params.plate;
    const rerenderFunc = props.route.params.rerenderFunc;

    const restaurantData = useContext(Context).data[0];
    console.log("\n\n\n---- EDIT PLATE SCREEN ----");
    console.log("plate: ", plate);
    console.log("restaurantData: ", restaurantData);
    console.log("restaurantData[id]: ", restaurantData["id"]);

    const db = getFirestore(app);
    const storage = getStorage(app);
    const pratosRef = collection(db, 'restaurantes', restaurantData["id"], 'pratos');

    const navigation = useNavigation();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [plateName, setPlateName] = useState(plate["nome"]);
    const [plateDesc, setPlateDesc] = useState(plate["descricao"]);
    const [platePrice, setPlatePrice] = useState(plate["preco"]);
    const initialImageUri = (plate["imagePlateUrl"]) ? plate["imagePlateUrl"] : 'https://jvschamne.github.io/marmicraft/marmita.png';
    const [imagePlate, setImagePlate] = useState(initialImageUri);
    const [imagePlateUrl, setImagePlateUrl] = (plate["imagePlateUrl"]) ? useState(plate["imagePlateUrl"]) : useState("");
    

    useEffect(() => {
      const updateImageData = async () => {
        console.log("USE EFFECT - IMAGE PLATE URL ALTERADO!!!");
        console.log("USE EFFECT - imagePlateUrl: ", imagePlateUrl);

        if(imagePlateUrl!=="" && imagePlateUrl!==plate["imagePlateUrl"]){
            await updateDoc(doc(pratosRef, plate.id), {
                "imagePlateUrl": imagePlateUrl,
            })
            .then(() => {
              navigation.navigate("Perfil");
              //navigation.dispatch(StackActions.pop(1));

              rerenderFunc(true);
            })
            // docSnap.data() will be undefined in this case
        }
        
      }
  
      updateImageData()
      .catch(
        (error) => console.log(error.message)
      );
  
    }, [imagePlateUrl])

    
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
        quality: 0.1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImagePlate(result.assets[0].uri);
      }
    };
    
  
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImagePlate(result.assets[0].uri);
      }
    };

    const uploadImage = async() => {
      console.log("uploading plate image...");
   
      const imageName = plateName+".jpg";
      const imageRef = ref(storage, imageName);
  
      const response = await fetch(imagePlate);
      let blobFile = await response.blob();
      let file = new File([blobFile], imageName, {
        type: "image/jpeg",
      });
  
      
      uploadBytes(imageRef, file)
        .then(() => {
          getDownloadURL(imageRef).
            then((url) => {
              setImagePlateUrl(url);
              console.log("imagePlateUrl: ", imagePlateUrl);
            })
            .catch((error) => {
              console.log(error.message, "error getting image url");
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
  
      file = null;
      blobFile = null;

      console.log("image uploaded");
      
    }


    const updatePlate = async () => {
        if(plateName!==plate["nome"] 
        || plateDesc!==plate["descricao"] 
        || platePrice!==plate["preco"]){
            await updateDoc(doc(pratosRef, plate.id), {
                nome: plateName,
                descricao: plateDesc, 
                preco: platePrice,
            }) 
        }

        if(imagePlate !== initialImageUri){
            await uploadImage();
        }
        else {
          navigation.navigate("Perfil");  
          //navigation.dispatch(StackActions.pop(1));

          rerenderFunc(true);
        }
    
        console.log('Prato atualizado com sucesso!');
        
    };

    return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>Editar prato</Text>
            <Image source={{ uri: imagePlate }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>


            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={plateName}
                onChangeText={text => setPlateName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={plateDesc}
                onChangeText={text => setPlateDesc(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Preço"
                value={platePrice}
                onChangeText={text => setPlatePrice(text)}
            />
            <TouchableOpacity style={styles.addButton} onPress={updatePlate}>
                <Text style={styles.buttonText}>SALVAR</Text>
            </TouchableOpacity>
          </ScrollView>

          <BottomTabNav></BottomTabNav>

        </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
    marginTop: 20,
  },
  image: {
    alignSelf: 'center',
    padding: 130,
    borderColor: '#fcc40d',
    marginBottom: 10,
    borderWidth: 8,
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 2000
  },
  photoButton: {
    marginTop: 20,
    backgroundColor: '#fcc40d',
    width: 140,
    height: 30,
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  galleryButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fcc40d',
    width: 140,
    height: 30,
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
  },
  title: {
    fontSize: 30,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  plates: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcc40d',
    width: '95%',
    marginTop: 50,
  },
  addReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '85%',
  },
  addButton: {
    backgroundColor: '#fcc40d',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: '25%',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  review: {
    backgroundColor: 'white',
    marginTop: 20,
    width: '95%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '100%',
  },
});
