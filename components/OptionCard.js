import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function OptionCard ({name, price, descricao, img, addOpcao}) {

    return(
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: img}} style={{ width: 70, height: 70, marginLeft: 15, marginRight: 15}}/>
            <View style={styles.itemInfo}>
                <Text style={{ marginBottom: 10, fontWeight: 'bold'}}>
                    {name}
                </Text>
                <Text style={{width: '70%', maxWidth: '70%',}}>
                    {descricao}
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
        marginRight: 15
    },
    itemInfo: {
        flexDirection: 'column',
    }
});
   