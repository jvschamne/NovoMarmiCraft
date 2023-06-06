import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../components/OptionCard';

export default function Restaurant(props) {
  const restaurantData = props.route.params;
  console.log("RESTAURANT SCREEN: ", restaurantData);
  const navigation = useNavigation();


  const opcoes = [
    ["X-Burguer", "R$22,90"], 
    ["Pizza", "R$42,90"], 
    ["Churros", "R$12,90"],
    ["Sonho", "R$5,90"]
  ]

  return(
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png' }} style={styles.logo}></Image>
        <Text style={styles.restaurantName}>{restaurantData["nome"]}</Text>
        <Text style={styles.address}>{restaurantData["bairro"]}, {restaurantData["rua"]}, {restaurantData["numero"]}</Text>
        <Text style={{fontSize: 15, marginTop: 15}}>1,5Km - Aberto</Text>
      </View>
      
      <Text style={{fontSize: 25, marginBottom: 25, marginTop: 25}}>Cardápio</Text>
      
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={{marginBottom: 100}}>
        {opcoes.length != 0 &&
          opcoes.map((opcao, i) => <OptionCard key={i} name={opcao[0]} price={opcao[1]}/>)
        }
        
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
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold'
  },
  address: {
    fontSize: 20, 
    marginTop: 10
  },
  logo: {
    marginTop: 10,
    width: 150,
    height: 150
  },
  scrollViewContent: {
    flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
  },
})
