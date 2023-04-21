import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import ListaTop from "../screens/Top/ListaTop";
import TopSucursales from "../screens/Top/TopSucursales";
import Top from "../screens/Top/Top";

export default function RutasTop(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="top-sucursales"
            component={TopSucursales}
            options={{title:"Top Sucursales"}}
            />
            <Stack.Screen
            name="lista-top"
            component={ListaTop}
            options={{title:"Top de Sucursales"}}
            />
            <Stack.Screen
            name="top"
            component={Top}
            options={{title:"Comentarios de sucursal"}}
            />
        </Stack.Navigator>
    );
}