import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, setDoc, getDoc, query, getDocs } from 'firebase/firestore';
import app from '../config/firebase';
import Context from './../Context';

import Pedido from '../components/Pedido';

export default function Menu() {
  const db = getFirestore(app);
  const navigation = useNavigation();

  const uId = useContext(Context).id[0];
  const [userType, setUserType] = useContext(Context).type;
  const [userData, setUserData] = useContext(Context).data;
  const [restaurantsData, setRestaurantsData] = useState([]);

  const pedidos = [
    ["X-Burguer", "Preparando", "RUa Pinto"],
    ["X-Bacon", "Entregando", "Rua FPD"],
    ["Pizza Calabresa", "Concluído", "Rua FPD"],
    ["Churros", "Aguardando Entregador", "ChurrosBangus"],
    ["Churros", "Aguardando Entregador", "ChurrosBangus"],
    ["Churros", "Aguardando Entregador", "ChurrosBangus"],
    ["Churros", "Aguardando Entregador", "ChurrosBangus"],
    ["Pizza Calabresa", "Concluído", "Rua FPD"],
  ];

  const getUserType = async () => {
    let type = "";
    let userData = {};

    const docRefClients = doc(db, "clientes", uId);
    const docRefRestaurants = doc(db, "restaurantes", uId);
    const docRefDelivery = doc(db, "entregadores", uId);

    const docSnapClients = await getDoc(docRefClients);
    const docSnapRestaurants = await getDoc(docRefRestaurants);
    const docSnapDelivery = await getDoc(docRefDelivery);

    console.log("\n\n----- MENU SCREEN -----");
    if (docSnapClients.exists()) {
      userData = docSnapClients.data();
      console.log("INFO CLIENTE LOGADO:", userData);
      type = "clientes";
      console.log("MENU TYPE: " + type);
    } else if (docSnapRestaurants.exists()) {
      userData = docSnapRestaurants.data();
      console.log("INFO RESTAURANTE LOGADO:", userData);
      type = "restaurantes";
      console.log("MENU TYPE: " + type);
    } else if (docSnapDelivery.exists()) {
      userData = docSnapDelivery.data();
      console.log("INFO ENTREGADOR LOGADO:", userData);
      type = "entregadores";
      console.log("MENU TYPE: " + type);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    setUserData(userData);
    setUserType(type);

    getRestaurantData();
  };

  const getRestaurantData = async () => {
    const q = query(collection(db, "restaurantes"));
    const querySnapshot = await getDocs(q);
    let restaurants = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      restaurants.push(doc.data());
    });

    setRestaurantsData(restaurants);
  };

  useEffect(() => {
    getUserType();
  }, []);

  console.log(userType);
  console.log("RESTAURANTS DATA: ", restaurantsData);
  console.log("length: ", restaurantsData.length !== 0);

  navigation.addListener('beforeRemove', (e) => e.preventDefault());
  console.log("userType: ", userType);

  if (userType === "clientes") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurantes</Text>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {(restaurantsData.length !== 0) &&
            restaurantsData.map((elem, i) => <RestaurantCard key={i} data={elem}></RestaurantCard>)
          }
        </ScrollView>
        <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
      </View>
    );
  } else if (userType === "restaurantes") {
    return (
      
      <View style={styles.container}>
        <Text style={styles.title}>Pedidos</Text>
        <ScrollView style={styles.pedidos} contentContainerStyle={styles.scrollViewContent}>
          {(pedidos.length !== 0) &&
            pedidos.map((info, i) => <Pedido key={i} info={info}></Pedido>)
          }
        </ScrollView>
        <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
  pedidos: {
    backgroundColor: '#fcc40d',
    width: '95%',
  }
});
