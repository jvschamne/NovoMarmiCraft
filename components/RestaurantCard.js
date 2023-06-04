import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantCard ({data}) {
    const dados = data;
    console.log("--- RESTAURANT CARD: ", dados["nome"], " ----");
    const navigation = useNavigation();

    const handleLogin = () => {
        console.log('ok')
        navigation.navigate('Restaurant', dados);
    };
    

    return(
        <TouchableOpacity style={styles.card} onPress={handleLogin}>
            <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png'}} style={styles.image}/>
            <View styles={styles.info}>
                <Text style={{ marginLeft: 30}}>
                    {dados["nome"]}
                </Text>
               
                    <Text style={{ marginLeft: 30}}>
                        Entrega: R$5,99
                    </Text>
              
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 70, 
        height: 70
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        height: 100,
        width: 300,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 25,
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  