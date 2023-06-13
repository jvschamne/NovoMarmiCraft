import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { getFirestore, collection, addDoc, getDocs, query } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para gerar IDs únicos
import BottomTabNav from '../components/BottomTabNav';
import app from '../config/firebase';
import Context from '../Context';

export default function Reviews(props) {
  const restaurantData = props.route.params;

  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState('')
  const db = getFirestore(app);
  const [uId, setUId] = useContext(Context).id;
  const [userData, setUserData] = useContext(Context).data;



  const handleAddReview = async () => {
    console.log('-------------ETAPA 5')
    const avaliacoesRef = collection(db, 'restaurantes', restaurantData["id"], 'avaliacoes');
    
    console.log('-------------ETAPA 6')
    // Crie um novo documento na subcoleção "avaliacoes" do restaurante
    await addDoc(avaliacoesRef, {
      clienteId: uId,
      nomeCliente: userData["nome"],
      comentario: newReview,
      classificacao: 0
    });

    console.log('Avaliação adicionada com sucesso!');
    // Limpe o campo de input
    setNewReview('');
  };

  const getReviewsData = async () => {

    const q = query(collection(db, 'restaurantes', restaurantData["id"], 'avaliacoes'));

    const querySnapshot = await getDocs(q);
    let auxReviews = [];
  

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      
      // Crie uma variável "data" e insira o doc.data()
      const data = doc.data();
      
      // Insira o ID no objeto "data"
      data.id = doc.id;
      
      // Adicione o objeto "data" ao array de reviews
      auxReviews.push(data);
    });

    setReviews(auxReviews);
  };


  useEffect(() => {
    getReviewsData()
  }, [newReview])


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <View style={styles.addReviewContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar review"
          value={newReview}
          onChangeText={text => setNewReview(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddReview}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.reviews}>
            {reviews.length !== 0 &&
        reviews.map((avaliacao) => {
          return (
            <View style={styles.review}>
              <Image source={{ uri: userData["imageDownloadUrl"] }} style={styles.imagem}></Image>
              <View>
                <Text style={{marginLeft: 20, fontWeight: 'bold'}}>{avaliacao["nomeCliente"]}</Text>
                <Text style={{marginLeft: 20}}>{avaliacao["comentario"]}</Text>
              </View>
              
            </View>
            
          );
        })
      }
      </ScrollView>
      
      <BottomTabNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
  title: {
    fontSize: 30,
    marginTop: 50,
  },
  reviews: {
    backgroundColor: '#fcc40d',
    width: '95%',
    marginTop: 30,
    marginBottom: 100,
  },
  addReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  input: {
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#fcc40d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  review: {
    backgroundColor: 'white',
    marginTop: 20,
    width: '95%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  scrollViewContent: {
    flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
  },
  imagem: {
    height: 50,
    width: 50,
    marginLeft: 20,
  }
});
