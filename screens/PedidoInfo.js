import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function PedidoInfo(props) {
   
  const info = props.route.params
  console.log("INFO:", info)

  const [location, setLocation] = useState([
    -25.436265,
    -49.269434,
  ])

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      } 
  
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      setLocation([latitude, longitude])
    } catch (error) {
      console.log('Erro ao obter a localização:', error);
    }
  };




  const initialRegion = {
    latitude: location[0],
    longitude: location[1] + 0.002,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };


  const initialMarkerCoordinate = {
    latitude: location[0] + 0.01,
    longitude: location[1] + 0.002,
  };

  let finalMarkerCoordinate = null;
  if (info[1]["latitude"] !== undefined && info[1]["latitude"] !== null) {
    finalMarkerCoordinate = {
      latitude: info[1]["latitude"],
      longitude: info[1]["longitude"],
    };
  } else {
    finalMarkerCoordinate = {
      latitude: -25.438748,
      longitude: -49.262370,
    };
  }


  const polylineCoordinates = [
    initialMarkerCoordinate, // Ponto inicial
    finalMarkerCoordinate, // Ponto final
  ];
  
  useEffect(() => {
    getLocation()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações do Pedido:</Text>
      <View>
        <Text style={styles.pedidoText}>{info[1]["pedido"]}</Text>
      </View>
      
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker coordinate={initialMarkerCoordinate} />
        <Marker coordinate={finalMarkerCoordinate} />
        <Polyline
          coordinates={polylineCoordinates}
          strokeWidth={2}
          strokeColor="red"
        />
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
  },
  map: {
    flex: 1,
    width: '80%',
    height: '60%'
  },
  pedidoText: {
    margin: 10,
  },
});
