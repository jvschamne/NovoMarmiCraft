import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Pedido = ( { info} ) => {

    return(
        <View style={styles.pedido}>
                <View style={styles.secao1}>
                    <Text style={styles.pedidoText}>{"Pedido: "+ info[0]}</Text>
                    <Text style={styles.pedidoStatus}>{info[1]}</Text>
                </View>
                
                <Text style={styles.pedidoText}>{"Endereço: "+ info[2]}</Text> 
        </View>
    )

};

const styles = StyleSheet.create({
    pedido : {
        backgroundColor: 'white',
        margin: 10,
        width: '90%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    pedidoText : {
        margin: 10,
    },
    pedidoStatus: {
        backgroundColor: "#fcc40d",
        padding: 5,
        borderRadius: 10,
        margin: 10,
        marginLeft: 40,
    },
    secao1: {
        flexDirection: 'row'
    },

  });



export default Pedido;