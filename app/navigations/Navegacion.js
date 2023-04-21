import React, {useState, useRef, useEffect} from "react";

import {firebaseApp} from "../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

//Importamos el contenedor de la estructura de navegacion
import { NavigationContainer } from "@react-navigation/native";

//Importamos el tipo de boton en este caso TAB
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

//Importamos el componente (vista) que se relacionara con el menu
import RutasSucursales from "./RutasSucursales";
import Busquedas from "../screens/Busquedas";
import Favoritos from "../screens/Favoritos";
import RutasTop from "./RutasTop";
import RutasCuentas from "./RutasCuentas"; 
import RutasComentarios from "./RutasComentarios";

//Importamos la libreria de react-native-elements para dar estilo al menu
import { Icon } from "react-native-elements";

//Creamos la estructura de tabs
const Tab = createBottomTabNavigator();



//Definimos el contenido del menu
export default function Navegacion() {
    const [usuario, setUsuario]=useState(null);
    useEffect(()=> {
        firebase.auth().onAuthStateChanged((userInfo)=> {
            setUsuario(userInfo);
        });
    },[]);

  return (
    <NavigationContainer>
        <Tab.Navigator
        //Define en que pagina deseas iniciar
        initialRouteName = "cuentas" //Cuentas es el nombre definido en el Tab.Screen
        tabBarStyle = {
          {
              
              //Color del texto o icono cuando no esta activo
              tabBarInactiveTintColor: "#52585E",
              //Color del texto e icono cuando esta activo
              tabBarActiveTintColor: "#00a680",
              
          }
        }

          //Para cada ruta cargada en el proyecto entonces =>
          screenOptions = {({route}) => ({
            /* Se asigna el color de la ruta al icono y se ejecuta la funcion opciones que recibe la ruta del
            menu y del color */
            tabBarIcon: ({color}) => opciones (route, color),
          })}
        >

            
            <Tab.Screen name="Sucursales" component={RutasSucursales} options={{headerShown: false }}/>
            
            {usuario && (
            <Tab.Screen name="Comentarios" component={RutasComentarios} options={{headerShown: false}} />
            )}
            
            <Tab.Screen name="Busquedas" component={Busquedas} options={{title:"Buscar"}} />
            <Tab.Screen name="Favoritos" component={Favoritos} options={{title:"Fav"}} />
            <Tab.Screen name="Top" component={RutasTop} options={{headerShown: false}} />
            <Tab.Screen name="Cuentas" component={RutasCuentas} options={{headerShown: false}} />
        </Tab.Navigator>
    </NavigationContainer>
  )
}

function opciones (ruta,color){
    let iconName;
    //De acuerdo a nombre de cada ruta se asigna un ícono
    switch(ruta.name){
        case "Busquedas":
            //para buscar iconos https://materialdesignicons.com/
            iconName="find-in-page";
            break;
        case "Cuentas":
            iconName="person";
            break;
        case "Favoritos":
            iconName="favorite";
            break;
        case "Sucursales":
            iconName="home";
            break;
        case "Comentarios":
            iconName="edit";
            break;
        case "Top":
            iconName="shop";
            break;
        default:
            break;
    }
    return(
        <Icon type="material-comunity" name={iconName} size={22} color={color} />
    )
}