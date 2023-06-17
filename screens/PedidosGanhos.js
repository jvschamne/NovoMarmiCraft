import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import { getFirestore, collection, doc, setDoc, getDoc, query, getDocs, where } from 'firebase/firestore';
import app from '../config/firebase';
import Context from '../Context';
import Pedido from '../components/Pedido';

export default function PedidosGanhos(props) {

    const db = getFirestore(app);

    const uId = useContext(Context).id[0];
    const [userType, setUserType] = useContext(Context).type;
    const [userData, setUserData] = useContext(Context).data;

    const [pedidos, setPedidos] = useState([
        ["X-Burguer", 22.90], 
        ["Pizza", 42.90], 
        ["Espetinho", 11,50],
        ["Churros", 12.90],
        ["Sonho", 5.90]
    ])


    const getPedidos = async () => {
        console.log("---------ETAPA1")
        const pedidosRef = collection(db, 'pedidos');
        const q = query(pedidosRef, where('clienteId', '==', uId));
        console.log("---------ETAPA2")

        const auxPedidos = []

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log('ID do pedido:', doc.id);
                console.log('Dados do pedido:', doc.data());
                auxPedidos.push([doc.data()])
            });
        } catch (error) {
            console.error('Erro ao encontrar os pedidos:', error);
        }

        setPedidos(auxPedidos)
        auxPedidos.forEach((po) => {
            console.log(po[0]["precoTotal"])
        })
       
    }

    useEffect(() => {
        getPedidos()
    }, [])


    if (userType !== "clientes") {
        return(
            <View style={styles.container}>
              <Text style={styles.title}>
                Seus ganhos hoje
              </Text>
              <View style={styles.ganhos}>
                <Text style={styles.title2}>R$35,90</Text>
                
              </View>
              
              
              <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
            </View>
        )
    }
    else {
          return(
            <View style={styles.container}>
              <Text style={styles.title}>
                Seus Pedidos
              </Text>
      
              <ScrollView style={styles.pedidos} contentContainerStyle={styles.scrollViewContent}>
                {(pedidos.length !== 0) &&
                    pedidos.map((info, i) => <Pedido key={i} info={info} type={'clientes'}></Pedido>)
                }
                </ScrollView>

               
              
              <BottomTabNav userData={userData} userType={userType}></BottomTabNav>
            </View>
          )

          
    }
    
}

const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingTop: 50,
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#f9f1f7',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 30,
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
      scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pedidos: {
    backgroundColor: '#fcc40d',
    width: '100%',
    marginBottom: 100
  },

 })