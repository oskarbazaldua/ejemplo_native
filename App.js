import React, {useEffect} from 'react';
//Importamos la estructura de nagación creada
import Navegacion from "./app/navigations/Navegacion";

//librerias conección firebase
import { firebaseApp } from './app/utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const db = firebase.firestore(firebaseApp);


export default function App(){
    useEffect(() => {
        //Ejecuta el proceso de autenticación y retorna
        //la información del usuario
        firebase.auth().onAuthStateChanged((user)=>{
            console.log(user);
        })
        },[]);
return <Navegacion/>
}

