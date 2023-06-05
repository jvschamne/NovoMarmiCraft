import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import BottomTabNav from '../components/BottomTabNav';

export default function Carrinho(props) {
    return(
        <View style={styles.container}>
            <Text>Carrinho</Text>
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