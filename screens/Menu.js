import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, setDoc, getDoc, query, getDocs } from 'firebase/firestore';
import app from '../config/firebase';
import Context from './../Context';

export default function Menu() {
  const db = getFirestore(app);
  const navigation = useNavigation();

  const uId = useContext(Context).id[0];
  const [userType, setUserType] = useContext(Context).type;
  const [userData, setUserData] = useContext(Context).data;
  const [restaurantsData, setRestaurantsData] = useState([]);

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
      console.log("MENU TYPE: "+type);
    } 
    else if (docSnapRestaurants.exists()) {
      userData = docSnapRestaurants.data();
      console.log("INFO RESTAURANTE LOGADO:", userData);
      type = "restaurantes";
      console.log("MENU TYPE: "+type);
    }
    else if (docSnapDelivery.exists()) {
      userData = docSnapDelivery.data();
      console.log("INFO ENTREGADOR LOGADO:", userData);
      type = "entregadores";
      console.log("MENU TYPE: "+type);
    }
    else {
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

  }

  useEffect(() => {
    getUserType();     
  }, []);


  console.log(userType)


  console.log("RESTAURANTS DATA: ", restaurantsData);
  console.log("lenght: ", (restaurantsData.length!==0));

  //console.log(restaurantData[0]["nome"]);


  //???
  navigation.addListener('beforeRemove', (e) => e.preventDefault());
  console.log("userType: ", userType);

  if(userType === "clientes"){
    return(
      <View style={styles.container}>
          <Text style={styles.title}>Restaurantes</Text>
          <View style={styles.restaurantList}>
            {(restaurantsData.length !== 0) &&

              restaurantsData.map((elem, i) => <RestaurantCard key={i} data={elem}></RestaurantCard>)
            

            }
          </View>
          <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
        
      </View>
    )
  }

  else if(userType === "restaurantes"){
    return(
      <View style={styles.container}>
          <Text style={styles.title}>Visão do Restaurante</Text>        
      </View>
    )
  }

  else{
    return;
  }
}

const styles = StyleSheet.create({
  restaurantList: {
    marginTop: 20,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold',
    marginTop: 50
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
});