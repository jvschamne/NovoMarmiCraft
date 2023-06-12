import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para gerar IDs únicos
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation, useRoute } from '@react-navigation/native';
import app from '../config/firebase';
import Context from '../Context';

export default function NewPlate() {
    const restaurantData = useContext(Context).data[0];
    console.log("\n\n\n---- NEW PLATE SCREEN ----");
    console.log("restaurantData: ", restaurantData);
    console.log("restaurantData[id]: ", restaurantData["id"]);

    const db = getFirestore(app);
    const [plateName, setPlateName] = useState("");
    const [plateDesc, setPlateDesc] = useState("");
    const [platePrice, setPlatePrice] = useState("");

    const handleAddPlate = async () => {
        const pratosRef = collection(db, 'restaurantes', restaurantData["id"], 'pratos');
        
        console.log('ADICIONANDO PRATO...');
        // Crie um novo documento na subcoleção "avaliacoes" do restaurante
        await addDoc(pratosRef, {
          nome: plateName,
          descricao: plateDesc,
          preco: platePrice
        });
    
        console.log('Avaliação adicionada com sucesso!');
        // Limpe o campo de input
        setPlateName('');
        setPlateDesc('');
        setPlatePrice('');
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo prato</Text>
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
                <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 30,
    marginTop: 40,
    marginBottom: 20,
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
