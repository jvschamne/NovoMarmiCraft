import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PlateCard ({data, cardType}) {
    const dados = data;
    console.log("--- PLATE CARD: ", dados["nome"], " ----");
    const navigation = useNavigation();

    const handleLogin = () => {
        console.log('ok')
        //navigation.navigate('Restaurant', dados);
    };
    
    if(cardType === "add"){
        return(
            <TouchableOpacity style={styles.card} onPress={handleLogin}>
                <Image source={require('../assets/plus-icon.png')} style={styles.image}/>
                <Text style={{fontSize: 15, marginLeft: 30}}>
                    ADICIONAR PRATO
                </Text>
            </TouchableOpacity>
        );
    }

    else if(cardType === "edit"){
        return(
            <TouchableOpacity style={styles.card} onPress={handleLogin}>
                <Image source={require('../assets/edit-icon.png')} style={styles.image}/>
                <Text style={{fontSize: 15, marginLeft: 30}}>
                    {dados["nome"]}
                </Text>
            </TouchableOpacity>
        );
    }

    return(
        <TouchableOpacity style={styles.card} onPress={handleLogin}>
            <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png'}} style={styles.image}/>
            <Text style={{fontSize: 15, marginLeft: 30}}>
                {dados["nome"]}
            </Text>
        </TouchableOpacity>
    );
    
}

const styles = StyleSheet.create({
    image: {
        marginLeft: 20,
        width: 50, 
        height: 50
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        height: 100,
        width: '90%',
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 25
    },
});
  