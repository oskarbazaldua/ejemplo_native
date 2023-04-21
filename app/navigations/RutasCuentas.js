import React from "react";
/* Importamos la libreria de StackNavigation, la cual permite definir la forma para que su aplicacion
haga la transicion entre pantallas */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Creamos el objeto de control de nuestra pila de pantallas
const Stack = createNativeStackNavigator();
//Imporatmos las pantallas que deseamos agregar a la ruta
import Cuentas from "../screens/Account/Cuentas";
import Login from '../screens/Account/Login';
import Registrar from '../screens/Account/Registrar';


export default function RutasCuentas(){
    //La primera pantalla que aparece en la pila sera la que se muestre
    // por default al importar nuestro archivo
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="cuentas"
            component={Cuentas}
            options={{title:"Mi cuenta"}}
            />
            <Stack.Screen
            name="login"
            component={Login}
            options={{title:"Iniciar Sesion"}}
            />

            <Stack.Screen
            name="Registrar"
            component={Registrar}
            options={{title:"Registro"}}
            />
        </Stack.Navigator>
        
        

        
    );
}
