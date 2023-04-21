{/* 
useState: Funcion que crea internamente una variable que define el estado del
componente.
Acepta un valor inicial para la varible y dos elementos, el valor de la varible y 
la funcion para modificarla.

useEffect: Empleada para procesar las llamadas API de firebase
y procesar el estado de la sesion.
*/}
import React, {useState, useEffect} from "react";
import firebase from "firebase/compat/app";
import 'firebase/auth';
import {Text, View} from "react-native";


//Importamos los componentes (vistas) de usuario logueado e invitado
import Logged from "./Logged";
import Invitado from "./Invitados";


export default function Cuentas(){
    const [login, setLogin] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false):setLogin(true);
        });
    },[]);
    if(login === null) return <Text>Cargando...</Text>;
    return login ? <Logged/>: <Invitado/>;
}
