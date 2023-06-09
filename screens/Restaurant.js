import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../components/OptionCard';
import { TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, getDoc, query, doc } from 'firebase/firestore';
import app from '../config/firebase';

export default function Restaurant(props) {

  const restaurantData = props.route.params
  const db = getFirestore(app);
  const navigation = useNavigation();

  //console.log("RESTAURANT SCREEN: ", restaurantData);

  
  const [pratos, setPratos] = useState([])


  const getRestaurantMenu = async () => {
    //console.log("ID rest:", restaurantData["id"])

    try{
      const q = query(collection(db, 'restaurantes', restaurantData["id"], 'pratos'))
      const querySnapshot = await getDocs(q);
      const dishes = [];
      querySnapshot.forEach((doc) => {
        dishes.push(doc.data());
      });

      //console.log(dishes)
      setPratos(dishes)
    }
    catch (error) {
      console.error("Error fetching restaurant menu:", error);
    }
    
  }


  const opcoes = [
    ["X-Burguer", 22.90], 
    ["Pizza", 42.90], 
    ["Espetinho", 11,50],
    ["Churros", 12.90],
    ["Sonho", 5.90] 
  ]

  const [opcoesEscolhidas, setOpcoesEscolhidos] = useState([])


  const addOpcao = (nomeEscolhido, precoEscolhido, imagemEscolhido) => {
    console.log(nomeEscolhido, precoEscolhido)

    const novaOpcaoEscolhida = [nomeEscolhido, precoEscolhido, imagemEscolhido]
    setOpcoesEscolhidos([...opcoesEscolhidas, novaOpcaoEscolhida])
  }

  useEffect(() => {
    getRestaurantMenu()
  }, [])


  return(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} style={{marginBottom: 100}}>
        <View style={styles.container2}>
          <Image source={{ uri: restaurantData["imageDownloadUrl"] }} style={styles.logo}></Image>
          <View style={styles.info}>
            <Text style={styles.restaurantName}>{restaurantData["nome"]}</Text>
            <Text style={styles.address}>{restaurantData["bairro"]}, {restaurantData["rua"]}, {restaurantData["numero"]}</Text>
            <Text style={{fontSize: 15, marginTop: 15}}>1,5Km - Aberto</Text>
          </View>
          
        </View>
        <TouchableOpacity style={styles.avaliacoes} onPress={() => navigation.navigate('Reviews', restaurantData)}>
          <Text style={{fontWeight: 'bold'}}>3 Estrelas - Avaliações</Text>
        </TouchableOpacity>
        
        <Text style={{fontSize: 25, marginBottom: 25, marginTop: 25}}>Cardápio</Text>
        
        
          {pratos.length != 0 &&
            pratos.map((prato, i) => <OptionCard 
            key={i} 
            name={prato["nome"]} 
            price={prato["preco"]} 
            descricao={prato["descricao"]} 
            img={prato["imagePlateUrl"]}
            addOpcao={addOpcao}/>)
          }
          
        

        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Carrinho', [restaurantData, opcoesEscolhidas])}>
          <Text style={{fontWeight: 'bold'}}>Ir para o carrinho</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomTabNav></BottomTabNav>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f1f7',
  },
  container2: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fcc40d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  restaurantName: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  address: {
    fontSize: 20, 
    marginTop: 10,
    width: '70%'
  },
  logo: {
    marginRight: 20,
    width: 100,
    height: 100,
  },
  scrollViewContent: {
    flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
  },
  avaliacoes: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
  },
  checkoutButton:{
    backgroundColor: '#fcc40d',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info:{
    width: '60%'
  }
})
