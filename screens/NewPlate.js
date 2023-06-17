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

export default function NewPlate(props) {
    const restaurantData = useContext(Context).data[0];
    console.log("\n\n\n---- NEW PLATE SCREEN ----");
    console.log("restaurantData: ", restaurantData);
    console.log("restaurantData[id]: ", restaurantData["id"]);

    const rerenderFunc = props.route.params.rerenderFunc;

    const db = getFirestore(app);
    const storage = getStorage(app);
    const pratosRef = collection(db, 'restaurantes', restaurantData["id"], 'pratos');
    const [newPlateRef, setNewPlateRef] = useState({});
    console.log("newPlateRef: ", newPlateRef);
    const navigation = useNavigation();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [plateName, setPlateName] = useState("");
    const [plateDesc, setPlateDesc] = useState("");
    const [platePrice, setPlatePrice] = useState("");
    const initialImageUri = 'https://jvschamne.github.io/marmicraft/marmita.png';
    const [imagePlate, setImagePlate] = useState(initialImageUri);
    const [imagePlateUrl, setImagePlateUrl] = useState("");
    const [wasCreated, setWasCreated] = useState(false);
    

    useEffect(() => {
      const updateImageData = async () => {
        //const docSnap = await getDoc(newPlateRef);
        console.log("USE EFFECT - IMAGE PLATE URL ALTERADO!!!");
        console.log("USE EFFECT - imagePlateUrl: ", imagePlateUrl);

        if(imagePlateUrl!==""){
          console.log("USE EFFECT - wasCreated: ", wasCreated);
          if(wasCreated){
            console.log("USE EFFECT - Prato já existe, e está sendo atualizado!")
            console.log("USE EFFECT - newPlateRef: ", newPlateRef);
            await updateDoc(newPlateRef, {
              "imagePlateUrl": imagePlateUrl,
            })
            .then(() => {
              navigation.navigate("Perfil");
              //navigation.dispatch(StackActions.pop(1));

              rerenderFunc(true);
            })  
          } 
          else {
            console.log("USE EFFECT - Prato não existe, mas acabou de ser criado!")
            const auxRef =  await addDoc(pratosRef, {
              "imagePlateUrl": imagePlateUrl,
            });
            setNewPlateRef(auxRef);
            console.log("newPlateRef: ", newPlateRef);
            setWasCreated(true);
            // docSnap.data() will be undefined in this case
          }
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


    const handleAddPlate = async () => {

        console.log("wasCreated: ", wasCreated);
        if (wasCreated) {
          console.log("Prato existe - dados:", docSnap.data());
          await updateDoc(newPlateRef, {
            nome: plateName,
            descricao: plateDesc,
            preco: platePrice,
          });
        } 
        else {
          console.log("Prato não existe, mas acabou de ser criado!")
          const auxRef = await addDoc(pratosRef, {
            nome: plateName,
            descricao: plateDesc,
            preco: platePrice,
          })
          .then(async (obj) => {
            setNewPlateRef(obj);
            console.log("newPlateRef: ", obj);
            setWasCreated(true);
            if(imagePlate !== initialImageUri){
              await uploadImage();
            }
            else{
              navigation.navigate("Perfil");
              //navigation.dispatch(StackActions.pop(1));

              rerenderFunc(true);
            }
          })
        }
    
        console.log('Prato adicionado com sucesso!');
        
    };

    return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>Novo prato</Text>
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
            <TouchableOpacity style={styles.addButton} onPress={handleAddPlate}>
                <Text style={styles.buttonText}>ADICIONAR</Text>
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
