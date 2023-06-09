import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para gerar IDs únicos
import BottomTabNav from '../components/BottomTabNav';
import app from '../config/firebase';
import Context from '../Context';

export default function Reviews(props) {
  const restaurantData = props.route.params;
  //console.log("Reviews SCREEN: ", restaurantData);

  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState()
  const db = getFirestore(app);
  
  const [userData, setUserData] = useContext(Context).data;
  const [uId, setUId] = useContext(Context).id;

/*
  const handleAddReview = async () => {
    console.log('-------------ETAPA 1')
    console.log(restaurantData)


    // Crie um novo documento na subcoleção "avaliacoes" do restaurante
    db.collection('restaurantes').doc(restauranteID).collection('avaliacoes').add({
        clienteID: clienteID,
        restauranteID: restauranteID,
        comentario: comentario,
        classificacao: classificacao
      })
      .then(() => {
        console.log('Avaliação adicionada com sucesso!');
        // Limpe os campos de comentário e classificação após adicionar a avaliação
        setComentario('');
        setClassificacao(0);
      })
      .catch(error => {
        console.error('Erro ao adicionar avaliação:', error);
      });


    /*
    const avaliacoesRef = collection(db, 'avaliacoes');
    console.log('-------------ETAPA 2')
    const clienteRef = doc(db, 'clientes', uId);
    console.log('-------------ETAPA 3')

    console.log(restaurantData)

    const restauranteRef = doc(db, 'restaurantes', "3YWSpZaNyISuFzMOk7fhhlUgU0a2");
    console.log('-------------ETAPA 4')
    




    /*const newReviewDoc = await setDoc(collection(db, 'avaliacoes'), {
        id: uuidv4(), // ID único para a avaliação
        clienteId: "Douglas Lanches",//uId, // ID do cliente (usuário autenticado)
        restauranteId: restaurantData["nome"], // ID do restaurante
        comentario: "putaira",
        estrelas: 5, // Exemplo: avaliação com 5 estrelas
    });


    /*await setDoc(avaliacoesRef, {"comentario": "Horrível",
        "estrelas": 2, 
        /*"cliente": uId,
        
        "restaurante": "3YWSpZaNyISuFzMOk7fhhlUgU0a2"*/
    //});

    /*
    console.log('-------------ETAPA 5')
     
    // Lógica para adicionar o novo comentário/review
    console.log('Novo review:', newReview);
    // Limpar o campo de input
    setNewReview('');

  };*/
  const handleAddReview = async () => {
    console.log('-------------ETAPA 1')
    const avaliacoesRef = collection(db, 'restaurantes', "3YWSpZaNyISuFzMOk7fhhlUgU0a2", 'avaliacoes');
    console.log('-------------ETAPA 2')
    const newReviewId = uuidv4(); // Gerar um ID único para a avaliação

    console.log("PUTARIA:", avaliacoesRef)
    console.log("PUTARIA:", restaurantData)


    console.log('-------------ETAPA 3')
    // Crie um novo documento na subcoleção "avaliacoes" do restaurante
    await addDoc(avaliacoesRef, {
      id: newReviewId,
      clienteId: uId,
      restauranteId: "3YWSpZaNyISuFzMOk7fhhlUgU0a2",
      comentario: newReview,
      classificacao: 0 // Defina a classificação inicial como 0 ou use um campo separado para atualizar a classificação posteriormente
    });

    console.log('Avaliação adicionada com sucesso!');
    // Limpe o campo de input
    setNewReview('');
  };


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
