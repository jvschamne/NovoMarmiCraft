import { useState } from "react";
import { KeyboardAvoidingView, View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import app from '../config/firebase';


export default function RegisterRestaurant() {
    const db = getFirestore(app);
    const restaurantsRef = collection(db, "restaurantes");

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [telefone, setTelefone] = useState('');

    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');

    const navigation = useNavigation();
    const auth = getAuth();

    const setData = async (id) => {
        try {       
            await setDoc(doc(restaurantsRef, id), {
                "bairro": neighborhood,
                "e-mail": email, 
                "nome": name,
                "numero": number, 
                "rua": street,
                "telefone" : telefone
            });
        } catch (error) {
            Alert.alert(error);
            console.log(error);
        }

    }
    
    const registerNewRestaurant = () => {
        if(name!=="" || email!=="" || password!=="" || telefone!=="" || neighborhood!=="" || street!=="" || number!==""){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                userID = userCredential.user.uid;
                
                Alert.alert("Usuário Criado! e-mail: "+email+" - senha: "+password+" - UID: "+userID);
                
                setData(userID);

                navigation.navigate("Login");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode === "auth/email-already-in-use"){
                    Alert.alert("Erro! Já existe uma conta cadastrada com esse e-mail");
                }
                else{
                    Alert.alert(errorMessage);
                }
            });
        }
        else{
            Alert.alert("Nenhum campo pode estar em branco!");
        }
    }

    return (
        <View style={styles.container}> 
            <>    
                <Text style={styles.title}>Informações gerais</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    onChangeText={text => setName(text)}
                    value={name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    onChangeText={text => setTelefone(text)}
                    value={telefone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    onChangeText={text => setPassword(text)}
                    value={password}
                />

                <Text style={styles.title}>Localização</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Bairro"
                    onChangeText={text => setNeighborhood(text)}
                    value={neighborhood}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Rua"
                    onChangeText={text => setStreet(text)}
                    value={street}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número"
                    onChangeText={text => setNumber(text)}
                    value={number}
                />


                <TouchableOpacity style={styles.button} onPress={registerNewRestaurant}>
                    <Text style={styles.buttonText}>CADASTRAR</Text>
                </TouchableOpacity>
            </>
        </View>
    );

    
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcc40d',
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginTop: 15,
        margin: 8,
        width: '80%',
    },
    title: {
        marginTop: 30,
        fontSize: 30,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center'
    },
    button: {
        backgroundColor: 'black',
        padding: 15,
        width: 200,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 30,
        marginTop: 32,
    },
    buttonText: {
        color: '#fcc40d',
        fontSize: 20,
    }
});

