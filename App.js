import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Menu from './screens/Menu'
import LoginScreen from './screens/Login';
import Restaurant from './screens/Restaurant';
import Signup from './screens/Signup';
import Register from './screens/Register';
import Perfil from './screens/Perfil';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
    
//firebase
import app from './config/firebase';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
const db = getFirestore(app);

//navigator
const Stack = createStackNavigator();


const App = () => {

  const getData = async () => {
    const docRef = doc(db, "clientes", "teste");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    getData()    
  });

 
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
};

export default App;