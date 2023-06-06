import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

const Pedido = ({ info, type }) => {
  const [status, setStatus] = useState(info[1]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleClick = () => {
    setModalVisible(true);
  };

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setModalVisible(false);
  };



  const statusRestaurante = ['Em processamento', 'Enviado', 'Entregue'];
  const statusEntregador = ['Levando ao cliente', 'Concluído']

  return (
    <View style={styles.pedido}>
      
        <View style={styles.secao1}>
          <TouchableOpacity onPress={handleClick} style={styles.pedidoStatus}>
            <Text>{status}</Text>
          </TouchableOpacity>
          <Text style={styles.pedidoText}>{"Pedido: " + info[0]}</Text>
          <Text style={styles.pedidoText}>{"Preço: " + info[3]}</Text>
          <Text style={styles.pedidoText}>{"Endereço: " + info[2]}</Text>
        </View>
      

      

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          {type === "restaurante" &&
            <FlatList
            style={styles.flatList}
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
            style={styles.flatList}
            data={statusEntregador}
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
         
        </View>
      </Modal>
    </View>
  );
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
    backgroundColor: 'rgba(112, 196, 82, 0.8)',
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 2,
    padding: 10
  }
});

export default Pedido;
