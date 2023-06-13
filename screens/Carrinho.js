import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import BottomTabNav from '../components/BottomTabNav';
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, collectionGroup, getDocs } from 'firebase/firestore';
import PedidoCliente from '../components/PedidoCliente';
import { useNavigation } from '@react-navigation/native';
import { useState, useContext, useEffect } from 'react';
import Context from '../Context';
import app from '../config/firebase';

export default function Carrinho(props) {
    
    const [uId, setUId] = useContext(Context).id;
    const db = getFirestore(app);
    
    const [metodosPagamento, setMetodosPagamento] = useState("")

    const getCardData = async () => {
        const dadosBancariosRef = collection(db, 'clientes', uId, 'dadosBancarios');
        console.log(dadosBancariosRef)
        const querySnapshot = await getDocs(dadosBancariosRef);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
            
                const numeroCartao = doc.data().numeroCartao;
                numCard = "**** **** **** " + numeroCartao.substring(numeroCartao.length - 4);
                console.log(numCard);
                
                setMetodosPagamento(numCard)
            })
        }
    }
    
    const handleBuyButton = () => {
        console.log()
        navigation.navigate('Perfil')
    }

    const navigation = useNavigation();


    const pedidoTemporario = [
        ["X-Burguer", "R$22,90"], 
        ["Pizza", "R$42,90"], 
        ["Churros", "R$12,90"],
        ["Sonho", "R$5,90"],
    ]

    useEffect(() => {
        getCardData()
    }, [])

    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}style={styles.container}>
                <Text style={styles.title}>Seu pedido</Text> 
                <ScrollView contentContainerStyle={styles.scrollViewContent} style={{
                    marginBottom: 400, marginTop: 20}}>
                        {pedidoTemporario.length != 0 &&
                            pedidoTemporario.map((opcao, i) => <PedidoCliente key={i} name={opcao[0]} price={opcao[1]}/>)
                        }
                </ScrollView>
                
                <View style={styles.pagamento}>
                    <Text style={{fontSize: 20, marginBottom: 20}}>Método de Pagamento</Text>
                    <View style={styles.dropdown1}>

                    
                    <SelectDropdown
                        dropdownStyle={styles.dropdown2}
                        data={[metodosPagamento]}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index)
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
                    <Text style={styles.label}>Gorjeta ao entregador</Text>
          <TextInput style={styles.input} />
          <Text style={styles.total}>Total a pagar: R$43,99</Text>
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