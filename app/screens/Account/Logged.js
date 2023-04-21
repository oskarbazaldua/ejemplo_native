import React from "react";
import {View, Text, Button} from "react-native";
import firebase from 'firebase/compat/app';


export default function Logged(){
    return(
        <View>
            <Text>Logged!!</Text>
            <Button
            title="Cerrar Sesión"
            onPress={()=>firebase.auth().signOut()}
            />
        </View>
    );
}