import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

const Pedido = ({ info }) => {
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



  const statusOptions = ['Em processamento', 'Enviado', 'Entregue'];

  return (
    <View style={styles.pedido}>
      <TouchableOpacity onPress={handleClick}>
        <View style={styles.secao1}>
          <Text style={styles.pedidoText}>{"Pedido: " + info[0]}</Text>
          <Text style={styles.pedidoStatus}>{status}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.pedidoText}>{"Endereço: " + info[2]}</Text>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <FlatList
            data={statusOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.statusOption}
                onPress={() => handleStatusSelect(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
         
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
    height: '20%',
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
    marginLeft: 40,
  },
  secao1: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  statusOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  updateButton: {
    backgroundColor: '#fcc40d',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Pedido;
