import React,{useState, useRef}from "react";
import {StyleSheet,View,Text} from "react-native";
import Toast from "react-native-easy-toast";
import FormSuc from "../../components/Sucursales/FormSuc";
//Importamos el formulario para registrar sucursales

export default function AgregarSuc(){
    const toastRef =useRef();
    return(
        <View>
            {/*Agregamos el formulario contenido en FormSuc */}
            <FormSuc
            toastRef={toastRef}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
    );
}
const styles = StyleSheet.create({})