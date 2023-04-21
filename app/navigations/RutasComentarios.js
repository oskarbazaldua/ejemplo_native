import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import Comentarios from "../screens/Comentarios/Comentarios";
import AgregarComent from "../screens/Comentarios/AgregarComent";

export default function RutasComentarios(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="comentario"
            component={Comentarios}
            options={{title:"Comentarios"}}
            />
            <Stack.Screen
            name="agregar-coment"
            component={AgregarComent}
            options={{title:"Nuevo Comentario"}}
            />
        </Stack.Navigator>
    );
}