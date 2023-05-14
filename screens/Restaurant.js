import { StyleSheet, Text, View, Image } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';
import { useNavigation } from '@react-navigation/native';
import OptionCard from '../components/OptionCard';

export default function Restaurant() {
    const navigation = useNavigation();

    const handleLogin = () => {
        console.log('ok')
        navigation.navigate('Login');
    };
    
  return(
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={{fontSize: 30}}>Churrassic Park</Text>
        <Text style={{fontSize: 20, marginTop: 15}}>Endereço</Text>
        <Text style={{fontSize: 20, marginTop: 15}}>1,5Km - Aberto</Text>
      </View>
      <Image source={{ uri: 'https://jvschamne.github.io/marmicraft/marmita.png' }} style={styles.logo}></Image>
      <Text style={{fontSize: 30, marginBottom: 35}}>Cardápio</Text>
      <OptionCard/>
      <OptionCard/>
      <OptionCard/>

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
    padding: '20px',
    backgroundColor: '#fcc40d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200
  },
})
