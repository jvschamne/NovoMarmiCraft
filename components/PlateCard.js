import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, collection, deleteDoc } from "firebase/firestore";

export default function PlateCard ({data, cardType, func, pratosRef}) {
    const dados = data;
    console.log("\n\n\n--- PLATE CARD ----");
    console.log("--- data: ", data, " ----");
    const navigation = useNavigation();

    const handleAdd = () => {
        console.log('add Plate')
        navigation.navigate('NewPlate', {"rerenderFunc": func});
    };

    const handleEdit = () => {
        console.log('edit Plate')
        navigation.navigate('EditPlate', {"plate": dados, "rerenderFunc": func});
    };

    const handleDelete = async () => {
        console.log("Excluindo prato ", dados["id"]);
        await deleteDoc(doc(pratosRef, dados["id"]))
        .then(() => {
            console.log(dados["id"], " excluído com sucesso");
            func(true);
            navigation.navigate("Perfil");
        }); 
    };
    
    if(cardType === "add"){
        return(
            <TouchableOpacity style={styles.card} onPress={handleAdd}>
                <Image source={require('../assets/plus-icon.png')} style={styles.image}/>
                <Text style={{fontSize: 15, marginLeft: 30}}>
                    ADICIONAR PRATO
                </Text>
            </TouchableOpacity>
        );
    }

    else if(cardType === "edit"){ 
        return(
            <View style={styles.card}>
                <Image source={{ uri: dados["imagePlateUrl"] }} style={styles.image}/>
                <View>
                    <Text style={styles.cardTitle}>
                        {dados["nome"]}
                    </Text>
                    <Text style={styles.priceText}>
                        R${dados["preco"]}
                    </Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Image source={require('../assets/edit-icon.png')} style={styles.editIcon}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.excludeButton} onPress={handleDelete}>
                    <Image source={require('../assets/trash-icon.png')} style={styles.trashIcon}/>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.card}>
            <Image source={{ uri: dados["imagePlateUrl"]}} style={styles.image}/>
            <View>
                <Text style={styles.cardTitle}>
                    {dados["nome"]}
                </Text>
                <Text style={styles.priceText}>
                    R${dados["preco"]}
                </Text>
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    image: {
        marginLeft: 15,
        width: 70, 
        height: 70,
        borderRadius: 10,
    },
    editIcon: {
        height: 25,
        width: 25,
    },
    editButton: {
        position: 'absolute',
        right: 15,
    },
    trashIcon: {
        height: 25,
        width: 25,
    },
    excludeButton: {
        position: 'absolute',
        right: 50,
    },
    cardTitle: {
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    priceText: {
        marginLeft: 35,
        fontSize: 18,
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
  