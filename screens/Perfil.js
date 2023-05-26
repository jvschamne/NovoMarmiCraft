import { StyleSheet, Text, View, StatusBar } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';

export default function Perfil() {

    return (
        <View style={styles.container}>
            <>
              <Text style={styles.title}>Perfil</Text>
            </>
    
          <StatusBar style="auto" />
          <BottomTabNav></BottomTabNav>
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcc40d',
    },
    title: {
        marginTop: 30,
        fontSize: 30,
        marginBottom: 20,
        width: '80%',
        textAlign: 'center'
    },
})