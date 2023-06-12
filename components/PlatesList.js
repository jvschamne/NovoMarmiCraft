import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Biblioteca para gerar IDs únicos
import BottomTabNav from './BottomTabNav';
import { useNavigation, useRoute } from '@react-navigation/native';
import app from '../config/firebase';
import Context from '../Context';
import PlateCard from './PlateCard';

export default function PlatesList({type}) {
  const restaurantData = useContext(Context).data[0];
  console.log("\n\n\n---- PLATES LIST COMPONENT ----");
  console.log("restaurantData: ", restaurantData);
  console.log("restaurantData[id]: ", restaurantData["id"]);

  const db = getFirestore(app);
  const [plates, setPlates] = useState([]);


  const getPlatesData = async () => {
    const q = query(collection(db, 'restaurantes', restaurantData["id"], 'pratos'));

    const querySnapshot = await getDocs(q);
    let auxPlates = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      data.id = doc.id;

      auxPlates.push(data);
    });

    setPlates(auxPlates);
  };

  useEffect(() => {
    getPlatesData()
  }, [])

  if(type !== "edit"){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pratos</Text>

        <View style={styles.plates}>
          {plates.length !== 0 &&
            plates.map((prato) => {
              return (
                <View style={styles.review}>
                  <Text>{prato}</Text>
                </View>
                
              );
            })
          }
        </View>

      </View>
    );
  }

  else{
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pratos</Text>

        <View style={styles.plates}>
          {plates.length !== 0 &&
            plates.map((prato) => {
              return (
                <View style={styles.review}>
                  <Text>{prato}</Text>
                </View>
                
              );
            })
          }
        </View>

        <PlateCard cardType="add"/>

      </View>
    );
  }
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
    marginTop: 15,
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
