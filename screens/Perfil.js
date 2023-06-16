import { StyleSheet, Text, View, Alert, TextInput, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import BottomTabNav from '../components/BottomTabNav';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, PermissionStatus, MediaTypeOptions} from 'expo-image-picker';
import Context from '../Context';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, collectionGroup, getDocs, addDoc } from 'firebase/firestore';
import { getDownloadURL, deleteObject, listAll, getStorage, uploadBytes, ref } from 'firebase/storage';
import app from '../config/firebase';
import PlateCard from '../components/PlateCard';
import exampleImage from '../assets/profile-icon.png';
import { CommonActions, useNavigation } from '@react-navigation/native';
const exampleImageUri = Image.resolveAssetSource(exampleImage).uri;


export default function Perfil() {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const navigation = useNavigation();
  
  const [userData, setUserData] = useContext(Context).data;
  const [userType, setUserType] = useContext(Context).type;
  const [uId, setUId] = useContext(Context).id;

  const userDocRef = doc(db, userType, uId);

 
  const [edit, setEdit] = useState(false);
  const initialImageUri = (userData["imageDownloadUrl"]) ? userData["imageDownloadUrl"] : exampleImageUri;
  const [image, setImage] = useState(initialImageUri);

  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  const [name, setName] = useState(userData["nome"]);
  //const [email, setEmail] = useState(userData["e-mail"]);
  const [neighbourhood, setNeighbourhood] = useState(userData["bairro"]);
  const [street, setStreet] = useState(userData["rua"]);
  const [number, setNumber] = useState(userData["numero"]);
  const [telefone, setTelefone] = useState(userData["telefone"]);
  const [imageDownloadUrl, setImageDownloadUrl] = (userData["imageDownloadUrl"]) ? useState(userData["imageDownloadUrl"]) : useState("");


  //dados bancarios
  console.log('-------------ETAPA 1');
  const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
  console.log(dadosBancariosRef);
  console.log('-------------ETAPA 2');
  

  const [nomeTitular, setNomeTitular] = useState('')
  const [numeroCartao, setNumeroCartao] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [cvv, setCVV] = useState('')
  const [pix, setPix] = useState('')


  //console.log("\n\n\n------TELA PERFIL------\nIMAGE DOWNLOAD URL: ", imageDownloadUrl);
  /*console.log("IMAGE URI: ", image);
  console.log("initialImageUri: "+initialImageUri);
  console.log("edit mode - setEdit = "+edit+"\n\n\n");*/


  const getDadosBancarios = async () => {
    const querySnapshot = await getDocs(dadosBancariosRef);
    console.log('GET DADOS BANCARIOS')
    if (!querySnapshot.empty) {
      // Documento já existe, atualize-o
      querySnapshot.forEach((doc) => {
        console.log("Documento já existe. Atualizando...");
        console.log(doc.data());
        setPix(doc.data().pix)

        setCVV(doc.data().CVV)
        setDataValidade(doc.data().dataValidade)
        setNomeTitular(doc.data().nomeTitular)
        setNumeroCartao(doc.data().numeroCartao)
      })}
  }

  useEffect(() => {
    const updateImageData = async () => {
      //console.log("USE EFFECT - IMAGE DOWNLOAD URL ALTERADO!!!")
      if(!userData["imageDownloadUrl"] || (userData["imageDownloadUrl"] && imageDownloadUrl!=="")){
        await updateDoc(userDocRef, {
          "imageDownloadUrl": imageDownloadUrl,
        });
  
        const docSnapUser = await getDoc(userDocRef);
        if (docSnapUser.exists()) {
          setUserData(docSnapUser.data());
        }

      }
    }

    updateImageData()
    .catch(
      (error) => console.log(error.message)
    );
    getDadosBancarios()

  }, [imageDownloadUrl])


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
    //console.log(hasPermission);
    if (!hasPermission){
        return;
    }

    // No permissions request is necessary for launching the image library
    const result = await launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    //console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
      setImage(result.assets[0].uri);
    }
  };


  const uploadImage = async() => {
    console.log("uploading image...");
 
    const imageName = uId+".jpg";
    const imageRef = ref(storage, imageName);

    const response = await fetch(image);
    let blobFile = await response.blob();
    let file = new File([blobFile], imageName, {
      type: "image/jpeg",
    });

    
    uploadBytes(imageRef, file)
      .then(() => {
        getDownloadURL(imageRef).
          then((url) => {
            setImageDownloadUrl(url)
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
    
  }


  // Salva mudanças feitas pelo usuário ao seu perfil
  const saveChanges = async () => {
    
    if(image !== initialImageUri){
      await uploadImage();
    }
   
    if(neighbourhood!==userData["bairro"] 
    || name!==userData["nome"] 
    || number!==userData["numero"] 
    || street!==userData["rua"] 
    || telefone!==userData["telefone"]){
      await updateDoc(userDocRef, {
        "bairro": neighbourhood,
        "nome": name, 
        "numero": number,
        "rua": street,
        "telefone": telefone,
      });

      const docSnapUser = await getDoc(userDocRef);
      if (docSnapUser.exists()) {
        setUserData(docSnapUser.data());
      }
    }


    console.log('-------------ETAPA 1');
    const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
    console.log(dadosBancariosRef);
    console.log('-------------ETAPA 2');
    
    const querySnapshot = await getDocs(dadosBancariosRef);

    if (!querySnapshot.empty) {
      // Documento já existe, atualize-o
      querySnapshot.forEach((doc) => {
        console.log("Documento já existe. Atualizando...");
        console.log(doc.data());

        // Faça as atualizações necessárias
        const updatedData = {
          pix: pix,
          nomeTitular: nomeTitular,
          numeroCartao: numeroCartao,
          dataValidade: dataValidade,
          CVV: cvv,
        };

        updateDoc(doc.ref, updatedData)
          .then(() => {
            console.log('Dados bancários atualizados com sucesso!');
          })
          .catch((error) => {
            console.error('Erro ao atualizar os dados bancários:', error);
          });
      });
    } else {
      // Documento não existe, crie um novo
      console.log("Documento não existe. Criando novo...");
      const newDocumentData = {
        pix: pix,
          nomeTitular: nomeTitular,
          numeroCartao: numeroCartao,
          dataValidade: dataValidade,
          CVV: cvv,
      };

      addDoc(dadosBancariosRef, newDocumentData)
        .then(() => {
          console.log('Novos dados bancários adicionados com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao adicionar novos dados bancários:', error);
        });
  }

  console.log('-------------ETAPA 3');

  setEdit(false);

  }


  const handleExit = () => {
    /*
    setUserData({})
    setUserType("");
    setUId("");
    navigation.navigate("Login")
    */
    navigation.reset({
        index: 0,
        routes: [
          { name: 'Login' },
        ],
      }
    );
  }


  
  // Caso não esteja no modo de edição
  if(!edit){
    if(userType === "clientes"){
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData["nome"]}</Text>

            <Image source={{ uri: image }} style={styles.image} />

            <Text style={styles.normalText}>{userData["bairro"]}</Text>
            <Text style={styles.normalText}>{userData["rua"]}, {userData["numero"]}</Text>
            <Text style={styles.normalText}>{userData["telefone"]}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => setEdit(true)}>
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleExit}>
              <Text style={styles.buttonText}>SAIR</Text>
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

            <Image source={{ uri: image }} style={styles.image} />

            <Text style={styles.normalText}>{userData["bairro"]}</Text>
            <Text style={styles.normalText}>{userData["rua"]}, {userData["numero"]}</Text>
            <Text style={styles.normalText}>{userData["telefone"]}</Text>

            <View style={styles.menu}>
              
              <TouchableOpacity style={styles.menuItemButton}>
                <PlateCard style={styles.menuItem} data={{"nome" : "prato"}}/>
              </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => setEdit(true)}>
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleExit}>
              <Text style={styles.buttonText}>SAIR</Text>
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
             <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>Atualizar dados bancários:</Text>
            <TextInput
              style={styles.input}
              placeholder="PIX"
              onChangeText={text => setPix(text)}
              value={pix}
            />
            <TextInput
              style={styles.input}
              placeholder="Titular do cartão"
              onChangeText={text => setNomeTitular(text)}
              value={nomeTitular}
            />
            <TextInput
              style={styles.input}
              placeholder="Número do cartão"
              onChangeText={text => setNumeroCartao(text)}
              value={numeroCartao}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de validade"
              onChangeText={text => setDataValidade(text)}
              value={dataValidade}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              onChangeText={text => setCVV(text)}
              value={cvv}
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
    editButton: {
      backgroundColor: 'black',
      padding: 15,
      width: 200,
      justifyContent: 'center', 
      alignItems:'center',
      alignSelf:'center',
      borderRadius: 30,
      marginTop: 32,
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