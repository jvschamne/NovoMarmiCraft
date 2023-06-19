import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, where, query, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import app from '../config/firebase';
import Context from '../Context';
const Pedido = ({ info, type }) => {

  const navigation = useNavigation()
  const db = getFirestore(app);
  const uId = useContext(Context).id[0];
  const [status, setStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [statusColor, setStatusColor] = useState(styles.blueBackground)
  const statusRestaurante = ['Aguardando entregador', 'Preparando', 'Entregando', 'Concluído'];
  const statusEntregador = ['Entregando', 'Concluído']
  
  //console.log("INFO:", info)
  //console.log("Status:", status)
  useEffect(() => {
      setStatus(info[1]["status"]);
  
  }, [info]);

  const handleClick = () => {
    setModalVisible(true);
  };

  const handleStatusSelect = async (newStatus) => {
    setStatus(newStatus);
    setModalVisible(false);

    try {
      //console.log("pedidoId:", info[0])
      //console.log("ETAPA 1")
      const pedidoRef = doc(db, 'pedidos', info[0]);
      //console.log("ETAPA 2")
      const pedidoSnapshot = await getDoc(pedidoRef);
  
      if (pedidoSnapshot.exists()) {
        await updateDoc(pedidoRef, { status: newStatus });
        console.log('Status do pedido atualizado com sucesso.');

        // Update the status in the info array
        if (type !== 'clientes') {
          info[1]['status'] = newStatus;
        } else {
          info[0]['status'] = newStatus;
        }


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

  const acceptPedido = async() => {
    console.log("accept:", info[1])
    try {
      const pedidoId = info[0];
      const entregadorId = uId; // Replace 'ID_DO_ENTREGADOR' with the actual ID of the delivery person
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      const pedidoSnapshot = await getDoc(pedidoRef);
  
      if (pedidoSnapshot.exists()) {
        await updateDoc(pedidoRef, { entregadorId, status: 'Entregando' });
        console.log('Pedido atualizado com o ID do entregador:', entregadorId);
      } else {
        console.log('O pedido não existe.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o pedido:', error);
    }
    info[1]["status"] = "Entregando"
    setStatus("Entregando")
  }

  const confirmarEntrega = async () => {
    setStatus("Entrega confirmada");
 
    try {
      console.log("pedidoId:", info[0])
      console.log("ETAPA 1")
      const pedidoRef = doc(db, 'pedidos', info[0]);
      console.log("ETAPA 2")
      const pedidoSnapshot = await getDoc(pedidoRef);
  
      if (pedidoSnapshot.exists()) {
        await updateDoc(pedidoRef, { status: "Entrega confirmada" });
        console.log('Status do pedido atualizado com sucesso.');

        // Update the status in the info array
        if (type !== 'clientes') {
          info[1]['status'] = "Entrega confirmada";
        } else {
          info[0]['status'] = "Entrega confirmada";
        }
      } else {
        console.log('O pedido não existe.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o status do pedido:', error);
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
  
  else if(type === "clientes"){
    return (
    

      <View style={styles.pedido}>
          <View style={styles.secao1}>
            
            
            <View style={[styles.pedidoStatus, statusColor]}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>{info[1]["status"]}</Text>
            </View>
            <Text style={styles.pedidoText}>{"Pedido: " + info[1]["pedido"]}</Text>
            <Text style={styles.pedidoText}>{"Preço: " + info[1]["precoTotal"]}</Text>
          </View>
          {info[1]["status"] === "Concluído" &&
                <TouchableOpacity style={styles.confirmButton} onPress={() => confirmarEntrega()}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Confirmar entrega</Text>
                </TouchableOpacity>
          }
          
        
  
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
            <TouchableOpacity style={[styles.pedidoStatus, statusColor]} onPress={handleClick}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>{info[1]["status"]}</Text>
            </TouchableOpacity>
            <Text style={styles.pedidoText}>{"Pedido: " + info[1]["pedido"]}</Text>
            <Text style={styles.pedidoText}>{"Preço: " + info[1]["precoTotal"]}</Text>
            <Text style={styles.pedidoText}>{"Endereço: " + info[1]["precoTotal"]}</Text>
          </View>

          {info[1]["status"] === "Aguardando entregador" &&
          <TouchableOpacity style={styles.acceptButton} onPress={() => acceptPedido()}>
            <Text style={{color: "white", fontWeight: 'bold',}}>Aceitar pedido</Text>
          </TouchableOpacity>
          } 
          {info[1]["status"] !== "Aguardando entregador" &&
          <TouchableOpacity style={styles.acceptButton} onPress={() =>{
            const auxPorra = info
            console.log(auxPorra)
            navigation.navigate('PedidoInfo', auxPorra)
            
            }}>
            <Text style={{color: "white", fontWeight: 'bold',}}>Detalhes do pedido</Text>
          </TouchableOpacity>
          }
        
  
        

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.modalContainer}>
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
              ></FlatList>
           
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
    height: 250,
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
  },
  acceptButton:{
    backgroundColor: "green",
    padding: 10,
    borderRadius: 15,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 15,
  }
});

export default Pedido;
