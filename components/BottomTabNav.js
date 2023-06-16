import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import Context from '../Context';


export default function BottomTabNav () {   
    

    const [userType, setUserType] = useContext(Context).type;

    const navigation = useNavigation();
     
    const handlePress = (screen) => {
        //console.log('navigate', screen)
        navigation.navigate(screen);
    };

    if(userType === "clientes"){
        return(
            <View style={styles.nav}>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('Menu')}>
                    <Text style={styles.text}>Restaurantes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('PedidosGanhos')}>
                    <Text style={styles.text}>Pedidos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('Perfil')}>
                    <Text style={styles.text}>Perfil</Text>
                </TouchableOpacity>
            </View>
        )
    }
    else {
        return(
            <View style={styles.nav}>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('Menu')}>
                    <Text style={styles.text}>Pedidos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('PedidosGanhos')}>
                    <Text style={styles.text}>Ganhos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => handlePress('Perfil')}>
                    <Text style={styles.text}>Perfil</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        marginTop:500,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    text : {
        color: '#fcc40d'
    }
});