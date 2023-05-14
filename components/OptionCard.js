import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OptionCard ({name}) {

    const navigation = useNavigation();

    const handleLogin = () => {
        console.log('ok')
        navigation.navigate('Restaurant');
    };
    

    return(
        <TouchableOpacity style={styles.card} onPress={handleLogin}>
            <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png'}}
            style={{ width: 70, height: 70}}/>
            <Text style={{fontSize: 15, marginLeft: 30}}>
                {name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
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
  