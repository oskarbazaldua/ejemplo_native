import React from "react";
/*Importamos la librearía de StackNavigation, la cual
permite definir forma para que su aplicación haga
la transición entre pantallas*/
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Creamos el objeto de control de nuestra pila de pantallas
const Stack = createNativeStackNavigator();
//importamos las pantallas que deseamos agregar a la ruta
import Sucursales from "../screens/Sucursales/Sucursales";
import AgregarSuc from "../screens/Sucursales/AgregarSuc"
import Sucursal from "../screens/Sucursales/Sucursal";
import AddReview from "../screens/Sucursales/AddReview";


export default function RutasSucursales(){
    //la primera pantalla que aparece en la pila será la que se muestre
    //por default al importar nuestro archivo 
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="sucursal"
            component={Sucursales}
            options={{title:"Sucursales"}}
            />
            <Stack.Screen
            name="agregar-suc"
            component={AgregarSuc}
            options={{title:"Nueva Sucursal"}}
            />
            <Stack.Screen
            name="ver_sucursal"
            component={Sucursal}
            options={{title:"Ver sucursal"}}
            />
            <Stack.Screen
            name="add-review-sucursal"
            component={AddReview}
            options={{title:"Agrega un comentario"}}
            />
            
        </Stack.Navigator>
    );
}