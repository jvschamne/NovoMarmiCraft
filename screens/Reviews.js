import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDocs, query } from 'firebase/firestore';
import BottomTabNav from '../components/BottomTabNav';
import app from '../config/firebase';
import Context from '../Context';

export default function Reviews(props) {
  const restaurantData = props.route.params;
  console.log("Reviews SCREEN: ", restaurantData);

  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState()
  const db = getFirestore(app);
  
  const [userData, setUserData] = useContext(Context).data;
  const [uId, setUId] = useContext(Context).id;


  const handleAddReview = async () => {
    console.log(restaurantData["avaliacoes"])
    console.log(restaurantData.id)


    
    console.log(userData["nome"])
    // Criar um novo documento para a nova avaliação
    console.log('1')
    
    /*const novaAvaliacao = {
        restaurante: restaurantData.id,
        comentario: newReview,
        data: new Date().toISOString(),
    };
    console.log('2')*/

    
    const avaliacoesRef = collection(db, 'avaliacoes');
    const clienteRef = doc(db, 'clientes', uId);

    await setDoc(avaliacoesRef, {
        "cliente": clienteRef,
        "comentario": "Horrível",
        "estrelas": 2, 
        "restaurante": "Kikao Burguer"
    });


    console.log('3')
    // Adicionar a nova avaliação no Firestore
 
    console.log('5')
      // Limpar o campo de input
    
    
     
    // Lógica para adicionar o novo comentário/review
    console.log('Novo review:', newReview);
    // Limpar o campo de input
    setNewReview('');

  };

  const getReviewData = async () => {
    const q = query(collection(db, "avaliacoes"));
    const querySnapshot = await getDocs(q);
    let reviewsData = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      reviewsData.push(doc.data());
    });

    setReviews(reviewsData);
  };

 
  useEffect(() => {
    getReviewData()
    console.log("\n\n")
    console.log("ReviewsData:", reviews)
    console.log("\n\n")
  }, [])


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      <View style={styles.reviews}>
        <Text>Review</Text>
        <Text>Review</Text>
        <Text>Review 3</Text>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
});
