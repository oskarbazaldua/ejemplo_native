import React, {useState} from "react";
import { firebaseApp } from "../../utils/firebase";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import { StyleSheet,View,ScrollView} from "react-native";
import {Image,Input,Button} from "react-native-elements";
import "firebase/compat/firestore";


import { useNavigation } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);


const FormComent = (toast) => {

   const [comentario, setComentario]=useState("");
   const navigation =useNavigation();

    const {toastRef}=toast;


    const enviar= () =>{
        if(!comentario){
            toastRef.current.show("No puedes dejar campos vacios");
        }
        else{
            db.collection("comentarios")
                .add({
                    //enviamos los datos a almacenar, la colección se crear por si sola
                    hora: new Date().toLocaleString(),
                    comentario:comentario,
                    creadoPor: firebase.auth().currentUser.email,
                }).then(()=>{
                    //si todo es correcto 
                    navigation.navigate("comentario");
                })
        }
    };
    return(
        <ScrollView style={styles.scroll}>
            <Fomulario2
            //setHora={setHora}
            setComentario={setComentario}
            />
            <Button
            title="Envíar"
            buttonStyle={styles.btn}
            onPress={enviar}
            />
        </ScrollView>
    );
}; export default FormComent;



function Fomulario2(propiedades){
    const{
        setComentario,
    }=propiedades;

    return(
        <ScrollView>
            <Image
            source={require("../../../assets/img/c.png")}
            resizeMethod="auto"
            style={styles.logocoment}
            alignItems='center'
            />
        <View style={styles.vista}>
            <Input
            placeholder="Comentario"
            multiline={true}
            inputContainerStyle={styles.textArea}
            onChange={(e)=> setComentario(e.nativeEvent.text)}
            />
        </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    scroll:{
        height:"100%",
    },
    vista:{
        marginBottom:10,
    },
    textArea:{
        height:100,
        width:"100%",
        padding:0,
        margin:0,
    },
    btn:{
        backgroundColor:"#0A6ED3",
        margin:20,
    },
    logocoment:{
        width:"75%",
        height:150,
        marginTop:20,
        marginLeft:50,
    },
})