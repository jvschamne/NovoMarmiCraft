import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OptionCard ({name, price, addOpcao}) {

    const navigation = useNavigation();

    const handleAddButton = () => {
        console.log('ok')
        navigation.navigate('Carrinho')
    };
    

    return(
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png'}} style={{ width: 70, height: 70}}/>
            <View style={styles.itemInfo}>
                <Text style={{ marginBottom: 10, fontWeight: 'bold'}}>
                    {name}
                </Text>
                <Text>
                    {price}
                </Text>
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress={() => addOpcao(name, price)}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                   +
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        height: 100,
        width: '90%',
        borderRadius: 25,
        marginBottom: 25,
        elevation: 5,
        shadowColor: 'black',
    },
    addButton: {
        color: 'white',
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcc40d',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
    },
    itemInfo: {
        flexDirection: 'column',
    }
});
   