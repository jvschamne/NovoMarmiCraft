import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, setDoc} from 'firebase/firestore';
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
  const pratosRef = collection(db, 'restaurantes', restaurantData["id"], 'pratos');
  const navigation = useNavigation();
  const [plates, setPlates] = useState([]);
  const [getData, setGetData] = useState(true);


  const getPlatesData = async () => {
    const q = query(pratosRef);

    const querySnapshot = await getDocs(q);
    let auxPlates = [];
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      data.id = doc.id;

      auxPlates.push(data);
    });

    setPlates(auxPlates);
    //plates = auxPlates;
  };

  useEffect(() => {
    if(getData){
      getPlatesData();
      setGetData(false);
    }
  }, [getData]);

  if(type !== "edit"){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>PRATOS</Text>

        <View style={styles.plates}>
          {plates.length !== 0 &&
            plates.map((prato, i) => {
              return (
                <PlateCard key={i} data={prato}/>
              );
            })
          }
        </View>

        {/*
        <TouchableOpacity style={styles.editMenuButton} onPress={() => navigation.navigate("EditPlatesMenu", plates)}>
          <Text>EDITAR CARDÁPIO</Text>
        </TouchableOpacity>
        */}

      </View>
    );
  }

  else {
    return (
      <View style={styles.editContainer}>
      
        <Text style={styles.title}>PRATOS</Text>
        <Text style={styles.subTitle}>* Alterações nos pratos são salvas automaticamente</Text>

        <View style={styles.plates}>
        {plates.length !== 0 &&
            plates.map((prato, i) => {
              return (
                  <PlateCard key={i} data={prato} cardType="edit" func={setGetData} pratosRef={pratosRef}/>
              );
            })
        }
        </View>

        <PlateCard cardType="add" func={setGetData} />

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
    marginBottom: 25,
  },
  editContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
    marginTop: 20,
    marginBottom: '20%',
  },
  title: {
    fontSize: 30,
    marginTop: 15,
    marginBottom: 20,
  },
  subTitle: {
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  plates: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f1f7',
    width: '100%',
    marginTop: 10,
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
  editMenuButton: {
    backgroundColor: '#fcc40d',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 30,
    marginTop: 10,
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
