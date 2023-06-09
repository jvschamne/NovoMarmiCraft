import React, { useEffect, useId, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './screens/Menu'
import LoginScreen from './screens/Login';
import Restaurant from './screens/Restaurant';
import Signup from './screens/Signup';
import Register from './screens/Register';
import Perfil from './screens/Perfil';
import Carrinho from './screens/Carrinho';
import Reviews from './screens/Reviews';
import PedidosGanhos from './screens/PedidosGanhos';
import PedidoInfo from './screens/PedidoInfo';
import NewPlate from './screens/NewPlate';
import { LogBox } from 'react-native';
import Context from './Context';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
    
//firebase
import app from './config/firebase';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import EditPlate from './screens/EditPlate';

const db = getFirestore(app);

const App = () => {
  const [userData, setUserData] = useState({});
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const Stack = createStackNavigator();
 
  return (

    <Context.Provider value={{data: [userData, setUserData], type: [userType, setUserType], id: [userId, setUserId]}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Carrinho" component={Carrinho} />
          <Stack.Screen name="Menu" component={Menu}  options={{gestureEnabled: false}}/>
          <Stack.Screen name="Restaurant" component={Restaurant} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Perfil" component={Perfil} />
          <Stack.Screen name="Reviews" component={Reviews} />
          <Stack.Screen name="PedidosGanhos" component={PedidosGanhos} />
          <Stack.Screen name="PedidoInfo" component={PedidoInfo} />
          <Stack.Screen name="NewPlate" component={NewPlate} />
          <Stack.Screen name="EditPlate" component={EditPlate} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  ); 
};

export default App;