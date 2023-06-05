import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import OptionCard from '../components/OptionCard';

export default function Carrinho(props) {



    const pedidoTemporario = [
        ["X-Burguer", "R$22,90"], 
        ["Pizza", "R$42,90"], 
        ["Churros", "R$12,90"],
        ["Sonho", "R$5,90"],
    ]

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Seu pedido</Text> 
            <ScrollView contentContainerStyle={styles.scrollViewContent} style={{marginBottom: 300}}>
                    {pedidoTemporario.length != 0 &&
                        pedidoTemporario.map((opcao, i) => <OptionCard key={i} name={opcao[0]} price={opcao[1]}/>)
                    }
            </ScrollView>
            
            <View style={styles.pagamento}>
                <Text style={{fontSize: 20, marginBottom: 30}}>Total a pagar: R$43,99</Text>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.textButton}>Finalizar pedido</Text>
                </TouchableOpacity>
            </View>
            <BottomTabNav></BottomTabNav>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f1f7',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 20,
    },
    checkoutButton: {
        backgroundColor: '#fcc40d',
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    },
    pagamento: {
        position: 'absolute',
        bottom: 150, // Ajuste conforme necessário
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 150,
    },
});