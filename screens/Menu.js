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
    ["X-Burguer", "Preparando", "Rua Jair Bolsonaro", "R$20,97"],
    ["X-Bacon", "Entregando", "Rua Patriotas", "R$20,97"],
    ["Pizza Calabresa", "Concluído", "Rua Paulo Kogos", "R$20,97"],
    ["Churros", "Aguardando entregador", "Rua ChurrosBangus", "R$20,97"],
    ["Churros", "Aguardando entregador", "Rua ChurrosBangus", "R$20,97"],
    ["Churros", "Aguardando entregador", "Rua ChurrosBangus", "R$20,97"],
    ["Pizza Calabresa", "Concluído", "Rua Putaria", "R$20,97"],
    ["Churros", "Aguardando entregador", "Rua ChurrosBangus", "R$20,97"],
  ];

  const pedidosEntregador = [
    ["X-Burguer", "Entregando", "Rua Jair Bolsonaro", "R$20,97"],
    ["X-Bacon", "Concluído", "Rua Patriotas", "R$20,97"],
    ["Pizza Calabresa", "Concluído", "Rua Paulo Kogos", "R$20,97"],
    ["Churros", "Concluído", "Rua ChurrosBangus", "R$20,97"],
    ["Churros", "Entregando", "Rua ChurrosBangus", "R$20,97"],
    ["Churros", "Entregando", "Rua ChurrosBangus", "R$20,97"],
    ["Pizza Calabresa", "Concluído", "Rua Putaria", "R$20,97"],
  ]

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
      //console.log("INFO CLIENTE LOGADO:", userData);
      type = "clientes";
      //console.log("MENU TYPE: " + type);
    } else if (docSnapRestaurants.exists()) {
      userData = docSnapRestaurants.data();
      //console.log("INFO RESTAURANTE LOGADO:", userData);
      type = "restaurantes";
      //console.log("MENU TYPE: " + type);
    } else if (docSnapDelivery.exists()) {
      userData = docSnapDelivery.data();
      //console.log("INFO ENTREGADOR LOGADO:", userData);
      type = "entregadores";
      //console.log("MENU TYPE: " + type);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    setUserData(userData);
    setUserType(type);

    getRestaurantData();
  };

  /*
  const getRestaurantData = async () => {
    const q = query(collection(db, "restaurantes"));
    const querySnapshot = await getDocs(q);
    let restaurants = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      
      console.log(doc.id, " => ", doc.data());
      // Crie um objeto com o ID e os dados do restaurante
      const restaurant = {
        id: doc.id,
        data: doc.data()
      };
      
      // Adicione o objeto ao array de restaurantes
      restaurants.push(restaurant);
    });

    setRestaurantsData(restaurants);

    console.log("")
    restaurants.forEach((rest) => {
      console.log("Rest:", rest)
    })
  };*/

  const getRestaurantData = async () => {
    const q = query(collection(db, "restaurantes"));
    const querySnapshot = await getDocs(q);
    let restaurants = [];
  
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      
      // Crie uma variável "data" e insira o doc.data()
      const data = doc.data();
      
      // Insira o ID no objeto "data"
      data.id = doc.id;
      
      // Adicione o objeto "data" ao array de restaurantes
      restaurants.push(data);
    });
  
    setRestaurantsData(restaurants);
  
    console.log("");
    restaurants.forEach((rest) => {
      //console.log("Rest:", rest);
    });
  };






  useEffect(() => {
    getUserType();
  }, []);

  /*console.log(userType);
  console.log("RESTAURANTS DATA: ", restaurantsData);
  console.log("length: ", restaurantsData.length !== 0);*/

  //console.log(restaurantData[0]["nome"]);


  //???
  //navigation.addListener('beforeRemove', (e) => e.preventDefault());
  //console.log("userType: ", userType);

  if (userType === "clientes") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurantes</Text>
        <ScrollView style={styles.restaurantes} contentContainerStyle={styles.scrollViewContent}>
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
            pedidos.map((info, i) => <Pedido key={i} info={info} type={'restaurante'}></Pedido>)
          }
          </ScrollView>
       
        
        <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
      </View>
    );
  }  
 
  else if (userType === "entregadores") {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Entregador
        </Text>
        <View style={styles.ganhos}>
          <Text style={styles.title2}>Seus ganhos hoje: R$35,90</Text>
          
        </View>
        <ScrollView style={styles.pedidos} contentContainerStyle={styles.scrollViewContent} >
          {(pedidosEntregador.length !== 0) &&
            pedidosEntregador.map((info, i) => <Pedido key={i} info={info} type={'entregador'}></Pedido>)
          }
        </ScrollView>
        
        
        <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
      </View>
    )
  }
  
  
  else {
    return null;
  }
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
  ganhos: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 25,
    width: '80%',
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teste: {
    width: '90%',
    height: '90%', // Alterado para 90% em vez de 80%
  },
  pedidos: {
    backgroundColor: '#fcc40d',
    width: '100%',
    marginBottom: 100
  },
  restaurantes: {
    marginBottom: 100,
    width: '85%',
  },
  scrollEntregador: {
    backgroundColor: '#fcc40d',
    width: '100%',
    marginBottom: 100
  },
});
