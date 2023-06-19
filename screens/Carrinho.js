import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import BottomTabNav from '../components/BottomTabNav';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, addDoc, collectionGroup, getDocs } from 'firebase/firestore';
import PedidoCliente from '../components/PedidoCliente';
import { useNavigation } from '@react-navigation/native';
import { useState, useContext, useEffect } from 'react';
import Context from '../Context';
import app from '../config/firebase';
import * as Location from 'expo-location';

export default function Carrinho(props) {
    const data = props.route.params
    const restaurantData = data[0]
    const [pedidos, setPedidos] = useState(data[1])
    console.log("Dados:", data[1])
    const [preco, setPreco] = useState(0)
    const navigation = useNavigation();
    const [location, setLocation] = useState(null)

    //console.log("RESTAURANTE DATA CARRINHO: ", restaurantData)
    const [uId, setUId] = useContext(Context).id;
    const db = getFirestore(app);
    
    console.log("DADOS CARRINHO:", data[0])

    const [metodosPagamento, setMetodosPagamento] = useState("")

    const getCardData = async () => {
        const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
        //console.log(dadosBancariosRef)
        const querySnapshot = await getDocs(dadosBancariosRef);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
            
                const numeroCartao = doc.data().numeroCartao;
                numCard = "**** **** **** " + numeroCartao.substring(numeroCartao.length - 4);
                //console.log(numCard);
                
                setMetodosPagamento(numCard)
            })
        }
    }

    const getLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            //console.log('Permissão de localização negada');
            return;
          } 
      
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          console.log('Latitude:', latitude);
          console.log('Longitude:', longitude);

          setLocation([latitude, longitude])
        } catch (error) {
          console.log('Erro ao obter a localização:', error);
        }
      };
   
    const handleBuyButton = async () => {

        console.log("oi")
        getLocation()
        console.log("o2")

        let nomesPedidos = []
        let precoPedidos = 0
        //tratando Pedidos
        pedidos.forEach(elem => {
            //console.log(elem)
            nomesPedidos.push(elem[0])
            let precoFloat = parseFloat(elem[1].replace(",", "."));
            precoPedidos += precoFloat
        })
        console.log("oi3")


        precoPedidos = precoPedidos.toFixed(2);
        console.log("oi4")
        

        const dadosPedidos = pedidos

        try {
          // Crie um novo documento de pedido na coleção "pedidos"
          const novoPedidoRef = await addDoc(collection(db, 'pedidos'), {
            pedido: nomesPedidos,
            precoTotal: precoPedidos,
            clienteId: uId,
            status: "Preparando",
            restauranteId: restaurantData["id"], 
            entregadorId: "",
            latitude: location[0],
            longitude: location[1],
          });
          
          // Obtenha o ID do novo pedido
          const novoPedidoId = novoPedidoRef.id;
      
          console.log('Novo pedido criado:', novoPedidoId);
      
         
          
          //redireciona
          navigation.navigate('Perfil');
        } catch (error) {
          console.error('Erro ao criar um novo pedido:', error);
        }
      };
      

    const removeOpcao = (idPedido) => {
        //console.log("Remove opcao", idPedido)
        // Crie uma nova lista de pedidos excluindo o pedido com a chave correspondente
        console.log(pedidos[idPedido])

        const removePedido = pedidos[idPedido]

        const novosPedidos = pedidos.filter(item => item !== removePedido);

        setPedidos(novosPedidos)
        // Atualize o estado "pedidos" com a nova lista de pedidos
    }  

    useEffect(() => {
        getCardData()
        
        let auxPreco = 0
        //tratando Pedidos
        pedidos.forEach(elem => {
            //console.log(elem)
            const precoFloat = parseFloat(elem[1].replace(",", "."));
            auxPreco += precoFloat
        })

        try{
            auxPreco = auxPreco.toFixed(2);
        }
        catch(error){
            console.log("ERRO:", error)
        }
        setPreco(auxPreco)

    }, [pedidos])
   
    return(
        <View style={styles.container}> 
            <ScrollView contentContainerStyle={styles.scrollViewContent}style={styles.container}>
                <Text style={styles.title}>Seu pedido</Text> 
    
                <ScrollView contentContainerStyle={styles.scrollViewContent} style={{
                    marginBottom: 400, marginTop: 20}}>
                        {pedidos.length != 0 &&
                            pedidos.map((opcao, i) => <PedidoCliente key={i} id={i} name={opcao[0]} price={opcao[1]} img={opcao[2]} funcaoRemove={removeOpcao}/>)
                        }
                </ScrollView>
                
                <View style={styles.pagamento}>
                    <Text style={{fontSize: 20, marginBottom: 20}}>Método de Pagamento</Text>
                    <View style={styles.dropdown1}>

                    
                    <SelectDropdown
                        dropdownStyle={styles.dropdown2}
                        data={[metodosPagamento]}
                        onSelect={(selectedItem, index) => {
                            //console.log(selectedItem, index)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                    </View>
                
          <Text style={styles.total}>Total a pagar: R${preco}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleBuyButton}>
            <Text style={styles.buttonText}>Finalizar pedido</Text>
          </TouchableOpacity>
                </View>
                
            </ScrollView>
                <BottomTabNav></BottomTabNav>
        </View>
        
    )
}


const styles = StyleSheet.create({
    dropdown1: {
        backgroundColor: '#fcc40d',
        color: 'white',
        borderRadius: 10,
        marginBottom: 10,
    },
    dropdown2:{
        backgroundColor: '#fcc40d',
        color: 'white'
    },
    input: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
    },
    total: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 20,
    },
    checkoutButton: {
        backgroundColor: '#fcc40d',
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f1f7',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 200,
    },
    pagamento: {
        position: 'absolute',
        bottom: 130,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
    },
});