import { StyleSheet, Text, View, Alert, TextInput, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState, useContext, useEffect, useRef } from 'react';
import BottomTabNav from '../components/BottomTabNav';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, PermissionStatus, MediaTypeOptions} from 'expo-image-picker';
import Context from '../Context';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, collectionGroup, getDocs, addDoc } from 'firebase/firestore';
import { getDownloadURL, deleteObject, listAll, getStorage, uploadBytes, ref } from 'firebase/storage';
import app from '../config/firebase';
import PlateCard from '../components/PlateCard';
import exampleImage from '../assets/profile-icon.png';
import { CommonActions, useNavigation } from '@react-navigation/native';
import PlatesList from '../components/PlatesList';
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
  const scrollRef = useRef();
  const initialImageUri = (userData.data["imageDownloadUrl"]) ? userData.data["imageDownloadUrl"] : exampleImageUri;
  const [image, setImage] = useState(initialImageUri);

  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  const [platesAdded, setPlatesAdded] = useState(false);

  const [name, setName] = useState(userData.data["nome"]);
  //const [email, setEmail] = useState(userData["e-mail"]);

  const [neighbourhood, setNeighbourhood] = useState(userData.data["bairro"]);
  const [street, setStreet] = useState(userData.data["rua"]);
  const [number, setNumber] = useState(userData.data["numero"]);
  const [pixEntregador, setPixEntregador] = useState(userData.data["chave PIX"]);
  const [telefone, setTelefone] = useState(userData.data["telefone"]);
  const [imageDownloadUrl, setImageDownloadUrl] = (userData.data["imageDownloadUrl"]) ? useState(userData.data["imageDownloadUrl"]) : useState("");


  //dados bancarios
  console.log('-------------ETAPA 1');
  const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
  console.log(dadosBancariosRef);
  console.log('-------------ETAPA 2');
  

  const [nomeTitular, setNomeTitular] = useState('')
  const [numeroCartao, setNumeroCartao] = useState('')
  const [dataValidade, setDataValidade] = useState('')
  const [cvv, setCVV] = useState('')
  const [pixCliente, setPixCliente] = useState('')

  // pix dados bancarios
  const getDadosBancarios = async () => {
    const querySnapshot = await getDocs(dadosBancariosRef);
    console.log('GET DADOS BANCARIOS')
    if (!querySnapshot.empty) {
      // Documento já existe, atualize-o
      querySnapshot.forEach((doc) => {
        console.log("Documento já existe. Atualizando...");
        console.log(doc.data());
        setPixCliente(doc.data().pix)

        setCVV(doc.data().CVV)
        setDataValidade(doc.data().dataValidade)
        setNomeTitular(doc.data().nomeTitular)
        setNumeroCartao(doc.data().numeroCartao)
      })}
  }

  useEffect(() => {
    const updateImageData = async () => {

      //console.log("USE EFFECT - IMAGE DOWNLOAD URL ALTERADO!!!")
      //if(!userData["imageDownloadUrl"] || (userData["imageDownloadUrl"] && imageDownloadUrl!=="")){

      console.log("USE EFFECT - IMAGE DOWNLOAD URL ALTERADO!!!")
      if(imageDownloadUrl!=="" && imageDownloadUrl!==userData.data["imageDownloadUrl"]){
        await updateDoc(userDocRef, {
          "imageDownloadUrl": imageDownloadUrl,
        });
  
        const docSnapUser = await getDoc(userDocRef);
        if (docSnapUser.exists()) {
          setUserData({
            data: docSnapUser.data(),
            id: userData.id
          });
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
      quality: 0.1,
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
    
    /*
    if(neighbourhood!==userData["bairro"] 
    || name!==userData["nome"] 
    || number!==userData["numero"] 
    || street!==userData["rua"] 
    || telefone!==userData["telefone"]){
    */
    
    if(neighbourhood!==userData.data["bairro"] 
    || name!==userData.data["nome"] 
    || number!==userData.data["numero"] 
    || street!==userData.data["rua"] 
    || telefone!==userData.data["telefone"]){
      await updateDoc(userDocRef, {
        "bairro": neighbourhood,
        "nome": name, 
        "numero": number,
        "rua": street,
        "telefone": telefone,
      });

      const docSnapUser = await getDoc(userDocRef);
      if (docSnapUser.exists()) {
        setUserData({
          data: docSnapUser.data(),
          id: userData.id
        });
      }
    }

    console.log('-------------ETAPA 1');
    const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
    console.log(dadosBancariosRef);
    console.log('-------------ETAPA 2');
    
    if(userType === "clientes"){
      const querySnapshot = await getDocs(dadosBancariosRef);

      if (!querySnapshot.empty) {
        // Documento já existe, atualize-o
        querySnapshot.forEach((doc) => {
          console.log("Documento já existe. Atualizando...");
          console.log(doc.data());

          // Faça as atualizações necessárias
          const updatedData = {
            pix: pixCliente,
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
            pix: pixCliente,
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
    }

    console.log('-------------ETAPA 3');

    setEdit(false);

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

  }


  const handleExit = () => {
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
          <ScrollView ref={scrollRef} style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData.data["nome"]}</Text>

            <Image source={{ uri: image }} style={styles.image} />

            <Text style={styles.normalText}>{userData.data["bairro"]}</Text>
            <Text style={styles.normalText}>{userData.data["rua"]}, {userData.data["numero"]}</Text>
            <Text style={styles.normalText}>Telefone: {userData.data["telefone"]}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => {
                setEdit(true);
                scrollRef.current?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }
            }>
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
          <ScrollView ref={scrollRef} style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData.data["nome"]}</Text>

            <Image source={{ uri: image }} style={styles.image} />

            <Text style={styles.normalText}>{userData.data["bairro"]}</Text>
            <Text style={styles.normalText}>{userData.data["rua"]}, {userData.data["numero"]}</Text>
            <Text style={styles.normalText}>Telefone: {userData.data["telefone"]}</Text>
              
            <PlatesList style={styles.plates}/>

            <TouchableOpacity style={styles.editButton} onPress={() => {
                setEdit(true);
                scrollRef.current?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }
            }>
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
    else if(userType === "entregadores"){
      return (
        <View style={styles.container}>
          <ScrollView ref={scrollRef} style={styles.scrollView}  contentContainerStyle={{alignItems: 'center'}}>
            <Text style={styles.title}>{userData.data["nome"]}</Text>

            <Image source={{ uri: image }} style={styles.image} />

            <Text style={styles.normalText}>Telefone: {userData.data["telefone"]}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => {
                setEdit(true);
                scrollRef.current?.scrollTo({
                  y: 0,
                  animated: true,
                });
              }
            }>
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
          <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              onChangeText={text => setName(text)}
              value={name}
            />
            <Text style={styles.text}>Bairro:</Text>
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              onChangeText={text => setNeighbourhood(text)}
              value={neighbourhood}
            />
            <Text style={styles.text}>Rua:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua"
              onChangeText={text => setStreet(text)}
              value={street}
            />
            <Text style={styles.text}>Número:</Text>
            <TextInput
              style={styles.input}
              placeholder="Número"
              onChangeText={text => setNumber(text)}
              value={number}
            />
            <Text style={styles.text}>Telefone:</Text>
            <TextInput
              style={styles.input}
              placeholder="Telefone (DD XXXXX-XXXX) "
              onChangeText={text => setTelefone(text)}
              value={telefone}
            />
             <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>Atualizar dados bancários:</Text>
             <Text style={styles.text}>PIX:</Text>
            <TextInput
              style={styles.input}
              placeholder="PIX"
              onChangeText={text => setPixCliente(text)}
              value={pixCliente}
            />
            <Text style={styles.text}>Titular do cartão:</Text>
            <TextInput
              style={styles.input}
              placeholder="Titular do cartão"
              onChangeText={text => setNomeTitular(text)}
              value={nomeTitular}
            />
            <Text style={styles.text}>Número do cartão:</Text>
            <TextInput
              style={styles.input}
              placeholder="Número do cartão"
              onChangeText={text => setNumeroCartao(text)}
              value={numeroCartao}
            />
            <Text style={styles.text}>Data de validade:</Text>
            <TextInput
              style={styles.input}
              placeholder="Data de validade"
              onChangeText={text => setDataValidade(text)}
              value={dataValidade}
            />
            <Text style={styles.text}>CVV:</Text>
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
          <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              onChangeText={text => setName(text)}
              value={name}
            />
            <Text style={styles.text}>Bairro:</Text>
            <TextInput
              style={styles.input}
              placeholder="Bairro"
              onChangeText={text => setNeighbourhood(text)}
              value={neighbourhood}
            />
            <Text style={styles.text}>Rua:</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua"
              onChangeText={text => setStreet(text)}
              value={street}
            />
            <Text style={styles.text}>Número:</Text>
            <TextInput
              style={styles.input}
              placeholder="Número"
              onChangeText={text => setNumber(text)}
              value={number}
            />
            <Text style={styles.text}>Telefone:</Text>
            <TextInput
              style={styles.input}
              placeholder="Telefone (DD XXXXX-XXXX) "
              onChangeText={text => setTelefone(text)}
              value={telefone}
            />

            <TouchableOpacity style={styles.restaurantEditButton} onPress={saveChanges}>
              <Text style={styles.buttonText}>SALVAR</Text>
            </TouchableOpacity>

            <PlatesList style={styles.plates} type="edit"/>
          
          </ScrollView>


          <StatusBar style="auto" />
          <BottomTabNav style={styles.bottomBar}></BottomTabNav>
          
        </View>
      );
    }
    else if(userType === "entregadores"){
      return (
        <View style={styles.container}>
          <ScrollView ref={scrollRef} style={styles.scrollView} contentContainerStyle={{alignItems: 'center'}}>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Text>Tirar foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <Text>Galeria</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              onChangeText={text => setName(text)}
              value={name}
            />
            <Text style={styles.text}>Chave PIX:</Text>
            <TextInput
              style={styles.input}
              placeholder="Chave PIX"
              onChangeText={text => setPixEntregador(text)}
              value={pixEntregador}
            />
            <Text style={styles.text}>Telefone:</Text>
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
    menu: {
      flex: 1,
      alignItems: "center",
      width: "100%",
      justifyContent: "flex-start",
      backgroundColor: "lightgray",
      paddingTop: 20,
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
    plates: {
      flex: 1,
      width: '100%',
      marginTop: 10,
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
      marginTop: 20,
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
      marginBottom: "30%",
    },
    restaurantEditButton: {
      backgroundColor: 'black',
      padding: 15,
      width: 200,
      justifyContent: 'center', 
      alignItems:'center',
      alignSelf:'center',
      borderRadius: 30,
      marginTop: 32,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fcc40d',
      fontWeight: 'bold',
      fontSize: 16,
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
      marginTop: 5,
      margin: 8,
      width: '80%',
    },
    text: {
      fontSize: 15,
      alignSelf: 'baseline',
      marginTop: 10,
      marginLeft: 50,
    },
})