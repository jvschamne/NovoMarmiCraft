import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, doc, setDoc, getDoc, query, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

export default function Menu(props) {
  const db = getFirestore(app);
  const navigation = useNavigation();
  const restaurantes = useState(["res1", "res2", "res3"])
  const uId = props.route.params.uId;
  console.log("LOGGED USER uID: "+uId);

  const [userType, setUserType] = useState("");
  const [restaurantData, setRestaurantData] = useState()

  const getUserType = async () => {
    let type = "";

    const docRefClients = doc(db, "clientes", uId);
    const docRefRestaurants = doc(db, "restaurantes", uId);
    const docRefDelivery = doc(db, "entregadores", uId);

    const docSnapClients = await getDoc(docRefClients);
    const docSnapRestaurants = await getDoc(docRefRestaurants);
    const docSnapDelivery = await getDoc(docRefDelivery);
    
    console.log("\n\n----- MENU SCREEN -----");
    if (docSnapClients.exists()) {
      console.log("INFO CLIENTE LOGADO:", docSnapClients.data());
      type = "clientes";
      console.log("MENU TYPE: "+type);
    } 
    else if (docSnapRestaurants.exists()) {
      console.log("INFO RESTAURANTE LOGADO:", docSnapRestaurants.data());
      type = "restaurantes";
      console.log("MENU TYPE: "+type);
    }
    else if (docSnapDelivery.exists()) {
      console.log("INFO ENTREGADOR LOGADO:", docSnapDelivery.data());
      type = "entregadores";
      console.log("MENU TYPE: "+type);
    }
    else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

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

    setRestaurantData(restaurants);

  }

  


  useEffect(() => {
    getUserType();    
  }, []);

  useEffect(() => {
    getRestaurantData();    
  }, []);

  console.log("MENU TYPE: "+userType);


  //???
  navigation.addListener('beforeRemove', (e) => e.preventDefault());

  return(
    <View style={styles.container}>
      <Text style={{fontSize: 30, marginBottom: 50}}>Restaurantes</Text>
      {(restaurantData.length !== 0) &&
        <RestaurantCard></RestaurantCard>
        //restaurantData.map(() => <RestaurantCard name={restaurantData[]["nome"]}></RestaurantCard>)

      }
      <BottomTabNav></BottomTabNav>
    </View>
  )

      /*
  return(
    <View style={styles.container}>
      <Text style={{fontSize: 30, marginBottom: 50}}>Restaurantes</Text>
        <RestaurantCard name={'Churassic Park'}/>
        <RestaurantCard name={'Douglas Lanches'}/>
        <RestaurantCard name={'Marmitex do Creitons'}/>
        <RestaurantCard name={'Shinobi Lamen'}/>
        <BottomTabNav></BottomTabNav>
    </View>
  )*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
}) 