import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../components/OptionCard';

export default function Restaurant(props) {
  const restaurantData = props.route.params;
  console.log("RESTAURANT SCREEN: ", restaurantData);
  const navigation = useNavigation();

  return(
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.restaurantName}>{restaurantData["nome"]}</Text>
        <Text style={styles.address}>{restaurantData["bairro"]}</Text>
        <Text style={styles.address}>{restaurantData["rua"]}</Text>
        <Text style={styles.address}>{restaurantData["numero"]}</Text>
        <Text style={{fontSize: 20, marginTop: 15}}>1,5Km - Aberto</Text>
      </View>
      <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png' }} style={styles.logo}></Image>
      <Text style={{fontSize: 30, marginBottom: 35}}>Cardápio</Text>
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <OptionCard/>
        <OptionCard/>
        <OptionCard/>
      </ScrollView>
      
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
  container2: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fcc40d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantName: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold'
  },
  address: {
    fontSize: 20, 
    marginTop: 5
  },
  logo: {
    width: 200,
    height: 200
  },
  scrollViewContent: {
    width: 350,
  },
})
