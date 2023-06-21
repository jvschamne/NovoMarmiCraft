import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, BackHandler, Alert } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import BottomTabNav from '../components/BottomTabNav';
import { getFirestore, collection, doc, setDoc, getDoc, where, query, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import app from '../config/firebase';
import Context from './../Context';

import Pedido from '../components/Pedido';

export default function Menu() {
  const db = getFirestore(app);

  const uId = useContext(Context).id[0];
  const [userType, setUserType] = useContext(Context).type;
  const [userData, setUserData] = useContext(Context).data;
  const [restaurantsData, setRestaurantsData] = useState([]);

  const [pedidosRestaurante, setPedidosRestaurante] = useState([]) 
  const [pedidosEntregador, setPedidosEntregador] = useState([])

  const getUserType = async () => {
    let type = "";
    let userData = {};

    const docRefClients = doc(db, "clientes", uId);
    const docRefRestaurants = doc(db, "restaurantes", uId);
    const docRefDelivery = doc(db, "entregadores", uId);

    const docSnapClients = await getDoc(docRefClients);
    const docSnapRestaurants = await getDoc(docRefRestaurants);
    const docSnapDelivery = await getDoc(docRefDelivery);

    //console.log("\n\n----- MENU SCREEN -----");
    if (docSnapClients.exists()) {
      userData.data = docSnapClients.data();
      //console.log("INFO CLIENTE LOGADO:", userData.data);
      userData.id = docSnapClients.id;
      console.log("INFO CLIENTE LOGADO:", userData, " - userData.id: ", userData.id);
      type = "clientes";
      //console.log("MENU TYPE: " + type);
    } else if (docSnapRestaurants.exists()) {
      userData.data = docSnapRestaurants.data();
      //console.log("INFO RESTAURANTE LOGADO:", userData.data);
      userData.id = docSnapRestaurants.id;
      console.log("INFO RESTAURANTE LOGADO:",  userData, " - userData.id: ", userData.id);
      type = "restaurantes";
      //console.log("MENU TYPE: " + type);
    } else if (docSnapDelivery.exists()) {
      userData.data = docSnapDelivery.data();
      //console.log("INFO ENTREGADOR LOGADO:", userData.data);
      userData.id = docSnapDelivery.id;
      console.log("INFO ENTREGADOR LOGADO:",  userData, " - userData.id: ", userData.id);
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
  
    //console.log("");
    restaurants.forEach((rest) => {
      //console.log("Rest:", rest);
    });
  };

 
  const getPedidosRestaurante = async () => {
    try { 
      //console.log("getPedidosRestaurante");
  
      //console.log("---------ETAPA1");
      const pedidosRef = collection(db, 'pedidos');
      //console.log(uId); 
      const q = query(pedidosRef, where('restauranteId', '==', uId));

      //console.log("---------ETAPA2");
      //console.log("Q:", q)
      const auxPedidos = [];
  
      const querySnapshot = await getDocs(q);
      //console.log("try2:", querySnapshot);
      querySnapshot.forEach((doc) => { 
        //console.log('ID do pedido:', doc.id);
        //console.log('Dados do pedido:', doc.data()); 
        auxPedidos.push([doc.id, doc.data()]);
      });
      //console.log("try3");
  
      setPedidosRestaurante(auxPedidos);
  
    } catch (error) {
      console.error('Erro ao encontrar os pedidos:', error);
    }
  }


  const getPedidosEntregador = async () => {
    console.log("-------------getPedidosEntregador----")
    try {
      console.log("getPedidosEntregador");
      console.log("---------ETAPA1");
      const pedidosRef = collection(db, 'pedidos');
      console.log(uId); 
      
      //pedidos entregando atual
      const q = query(pedidosRef,
        //where('status', '==', 'Aguardando entregador'),
        where('entregadorId', '==', uId)
      );
      console.log("---------ETAPA2"); 
      const auxPedidos = [];
  
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        console.log('ID do pedido:', doc.id); 
        console.log('Dados do pedido:', doc.data());
        auxPedidos.push([doc.id, doc.data()]);
      });
     
      //pedidos disponiveis na area
      const q2 = query(pedidosRef,
        where('status', '==', 'Aguardando entregador')
      );
     
      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((doc) => {
        console.log('ID do pedido:', doc.id); 
        console.log('Dados do pedido:', doc.data());
        auxPedidos.push([doc.id, doc.data()]);
      });
  
  
      setPedidosEntregador(auxPedidos);
  
    } catch (error) {
      console.error('Erro ao encontrar os pedidos:', error);
    }
  };
  

  useEffect(() => {
    getUserType();
    //getPedidosRestaurante();
    //console.log('pedidosRestaurante:', pedidosRestaurante);
  }, []);
  
  useEffect(() => {
    const intervalID = setInterval(() =>  {
      if(userType === "entregadores"){
        getPedidosEntregador()
      }
      else if(userType === "restaurantes"){
        getPedidosRestaurante()
      }
    }, 1500);

    return () => clearInterval(intervalID);
    
    //getPedidosEntregador()
    //console.log('pedidosEntregador:', pedidosEntregador);
  }, [userType]);
  

  //console.log("RESTAURANTS DATA: ", restaurantsData);
  //console.log("length: ", restaurantsData.length !== 0);

  //console.log(restaurantData[0]["nome"]);


  //???
  //navigation.addListener('beforeRemove', (e) => e.preventDefault());
  console.log("userType: ", userType);

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
          {(pedidosRestaurante.length !== 0) &&
            pedidosRestaurante.map((info, i) => <Pedido key={i} info={info} type={'restaurante'}></Pedido>)
          }
          </ScrollView>
       
        
        <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
      </View>
    );
  }  
 
  else if (userType === "entregadores") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pedidos disponíveis</Text>
        <ScrollView style={styles.pedidos} contentContainerStyle={styles.scrollViewContent}>
          {(pedidosEntregador.length !== 0) &&
            pedidosEntregador.map((info, i) => <Pedido key={i} info={info} type={'entregador'} />)
          }
        </ScrollView>
        <BottomTabNav userData={userData} userType={userType} />
      </View>
    );
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
    width: '95%',
  },
  scrollEntregador: {
    backgroundColor: '#fcc40d',
    width: '100%',
    marginBottom: 100
  },
});
