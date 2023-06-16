import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, where, query, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

const Pedido = ({ info, type }) => {

  const db = getFirestore(app);

  const [status, setStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusColor, setStatusColor] = useState(styles.blueBackground)
  const statusRestaurante = ['Aguardando entregador', 'Preparando', 'Entregando', 'Concluído'];
  const statusEntregador = ['Entregando', 'Concluído']
  
  console.log("INFO:", info[1])
  console.log("INFO:", info[1]["status"])
  console.log("INFO:", info[1]["pedidos"])
  console.log("INFO:", info[1]["precoTotal"])

  useEffect(() => {
    if (type !== "clientes") {
      setStatus(info[1]["status"]);
    } else {
      setStatus(info[0]["status"]);
    }
  }, [info, type]);

  const handleClick = () => {
    setModalVisible(true);
  };

  const handleStatusSelect = async (newStatus) => {
    setStatus(newStatus);
    setModalVisible(false);

    try {
      console.log("pedidoId:", info[0])
      console.log("ETAPA 1")
      const pedidoRef = doc(db, 'pedidos', info[0]);
      console.log("ETAPA 2")
      const pedidoSnapshot = await getDoc(pedidoRef);
  
      if (pedidoSnapshot.exists()) {
        await updateDoc(pedidoRef, { status: newStatus });
        console.log('Status do pedido atualizado com sucesso.');
        return true;
      } else {
        console.log('O pedido não existe.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar o status do pedido:', error);
      return false;
    }

  };


  useEffect(() => {
    if(status === 'Concluído') setStatusColor(styles.greenBackground)
    if(status === 'Preparando') setStatusColor(styles.redBackground)
    if(status === 'Entregando') setStatusColor(styles.blueBackground)
    if(status === 'Aguardando entregador') setStatusColor(styles.yellowBackground)
  }, [status])
  
  if(type === "restaurante"){
  return (
    

    <View style={styles.pedido}>
      
        <View style={styles.secao1}>
          <TouchableOpacity onPress={handleClick} style={[styles.pedidoStatus, statusColor]}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>{status}</Text>
          </TouchableOpacity>
          <Text style={styles.pedidoText}>{"Pedido: " + info[1]["pedido"]}</Text>
          <Text style={styles.pedidoText}>{"Preço: " + info[1]["precoTotal"]}</Text>
          <Text style={styles.pedidoText}>{"Endereço: " + info[1]["status"]}</Text>
        </View>
      

      

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          {type === "restaurante" &&
            <FlatList
            contentContainerStyle={styles.flatList}
            data={statusRestaurante}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => handleStatusSelect(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />}
          {type === "entregador" &&
            <FlatList
          
            contentContainerStyle={styles.flatList}
            data={statusEntregador}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => handleStatusSelect(item)}
              >
                <Text style={{fontWeight: 'bold', fontSize: 30}}>{item}</Text>
              </TouchableOpacity>
            )}
          />}
         
        </View>
      </Modal>
    </View>
  );
  }
  
  else{
    return (
    

      <View style={styles.pedido}>
        
          <View style={styles.secao1}>
            <View style={[styles.pedidoStatus, statusColor]}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>{info[0]["status"]}</Text>
            </View>
            <Text style={styles.pedidoText}>{"Pedido: " + info[0]["pedido"]}</Text>
            <Text style={styles.pedidoText}>{"Preço: " + info[0]["precoTotal"]}</Text>
            <Text style={styles.pedidoText}>{"Endereço: " + info[0]["precoTotal"]}</Text>
          </View>
        
  
        
  
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            {type === "restaurante" &&
              <FlatList
              contentContainerStyle={styles.flatList}
              data={statusRestaurante}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />}
            {type === "entregador" &&
              <FlatList
            
              contentContainerStyle={styles.flatList}
              data={statusEntregador}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusSelect(item)}
                >
                  <Text style={{fontWeight: 'bold', fontSize: 30}}>{item}</Text>
                </TouchableOpacity>
              )}
            />}
           
          </View>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  pedido: {
    backgroundColor: 'white',
    margin: 10,
    width: '90%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  pedidoText: {
    margin: 10,
  },
  pedidoStatus: {
    backgroundColor: '#fcc40d',
    padding: 5,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secao1: {
    flexDirection: 'column',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
    marginTop: '70%',
  },
  statusOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatList: {
    backgroundColor: 'white',
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 2,
    padding: 10,
    height: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Centraliza os itens verticalmente
  },
  greenBackground: {
    backgroundColor: 'green'
  },
  blueBackground: {
    backgroundColor: 'blue'
  },
  redBackground: {
    backgroundColor: 'red'
  },
  yellowBackground: {
    backgroundColor: 'purple'
  }


});

export default Pedido;
