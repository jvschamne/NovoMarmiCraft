import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function PedidoInfo(props) {
  const info = props.route.params;
  console.log("INFO:", info);

  const [location, setLocation] = useState(null);
  const [isLocationObtained, setLocationObtained] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permissão de localização negada');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setLocation([latitude, longitude]);
        setLocationObtained(true);
      } catch (error) {
        console.log('Erro ao obter a localização:', error);
      }
    };

    getLocation();
  }, []);

  const defaultLatitude =  -15.799830;
  const defaultLongitude = -47.864452;

  const initialRegion = {
    latitude: location ? location[0] : defaultLatitude,
    longitude: location ? location[1] : defaultLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const initialMarkerCoordinate = {
    latitude: location ? location[0] : defaultLatitude,
    longitude: location ? location[1] : defaultLongitude,
  };

  let finalMarkerCoordinate = null;
  if (info[1]['latitude'] !== undefined && info[1]['latitude'] !== null) {
    finalMarkerCoordinate = {
      latitude: info[1]['latitude'],
      longitude: info[1]['longitude'],
    };
  } else {
    finalMarkerCoordinate = {
      latitude: defaultLatitude,
      longitude: defaultLongitude,
    };
  }

  const polylineCoordinates = [initialMarkerCoordinate, finalMarkerCoordinate];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informações do Pedido:</Text>
      <View>
        <Text style={styles.pedidoText}>{info[1]['pedido']}</Text>
      </View>

      {location && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker coordinate={initialMarkerCoordinate} />
          <Marker coordinate={finalMarkerCoordinate} />
          <Polyline coordinates={polylineCoordinates} strokeWidth={2} strokeColor="red" />
        </MapView>
      )}
      {!location && (
        <Text style={{fontSize: 25, marginTop: 40}}>Carregando mapa</Text>
      )}
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
    height: '60%',
  },
  pedidoText: {
    margin: 10,
  },
});
