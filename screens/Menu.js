import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RestaurantCard from '../components/RestaurantCard';
import BottomTabNav from '../components/BottomTabNav';

export default function Menu() {

  const restaurantes = useState(["res1", "res2", "res3"])

  return(
    <View style={styles.container}>
      <Text style={{fontSize: 30, marginBottom: 50}}>Restaurantes</Text>
        <RestaurantCard name={'Churassic Park'}/>
        <RestaurantCard name={'Douglas Lanches'}/>
        <RestaurantCard name={'Marmitex do Creitons'}/>
        <RestaurantCard name={'Shinobi Lamen'}/>
        <BottomTabNav></BottomTabNav>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f1f7',
  },
}) 