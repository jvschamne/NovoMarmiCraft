import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantCard ({data}) {


    const dados = data;
    const navigation = useNavigation();

    const handleLogin = () => {
        navigation.navigate('Restaurant', data);
    };
    

    return(
        <TouchableOpacity style={styles.card} onPress={handleLogin}>
            <Image source={{ uri: dados["imageDownloadUrl"]}} style={styles.image}/>
            <View styles={styles.info}>
                <Text style={{ marginLeft: 30, fontWeight: 'bold'}}>
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
        height: 70,
        borderRadius: 15
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        height: 100,
        width: '95%',
        borderRadius: 25,
        marginBottom: 25,
        padding: 20,
        elevation: 5,
        shadowColor: 'black',
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  