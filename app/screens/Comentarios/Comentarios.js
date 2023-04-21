import React, {useState, useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native";
import {StyleSheet,View} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import Toast from "react-native-easy-toast";
import FormComent from "../../components/Comentarios/FormComent";

import {firebaseApp} from "../../utils/firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);

//import ListaComentarios from "./ListaComentarios";
import ListaComentarios from "../Comentarios/ListaComentarios";

export default function Comentarios(){
    const navegacion=useNavigation();
    const [comentarios, setComentarios]=useState([]);
    //useState para contar comentarios
    const [totalCom, setTotalCom]=useState(0);
    //useState para mantener el control de los comentarios a mostrar
    const [puntero, setPuntero]=useState(null); 

    useFocusEffect(
        useCallback(()=>{
            /*Accedemos a la colección sucursales, consultamos los registros
        con get y atrapamos la respuesta (se retorna una promesa con la lista sucursales)
        contamos y asignamos el total de comentarios al useState totalSuc*/
        db.collection("comentarios")
        .get()
        .then((res)=>{
            setTotalCom(res.size);
        });
        const arrComentarios=[];
        db.collection("comentarios").limit(10).get()
        .then((res)=>{
            setPuntero(res.docs[res.docs.length -1]);
            res.forEach((doc)=>{
                //extraemos cada documento y lo almacenamos en un objeto comentario
                const comentario =doc.data();
                //la clave de la comentario no asigna a menos que lo indiquemos
                comentario.id =doc.id;
                //almacenamos cada comentario en un arreglo
                arrComentarios.push(comentario);
            });
            //al terminar de recuperar todos los documentos los almacenamos en el useState comntarios
            setComentarios(arrComentarios);
        });

        },[])
    );

    return(
        <View style={styles.vista}>
            
            <ListaComentarios comentarios={comentarios}/>
            <Icon
            reverse
            type="material_community"
            name="comment"
            color="#0A6ED3"
            containerStyle={styles.btn}
            onPress={()=>navegacion.navigate("agregar-coment")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    vista:{
        flex:1,
        backgroundColor:"#FFFF",
    },
    btn:{
        position:"absolute",
        bottom:10,
        right:10,
        //Para iOS mostrará una sombra para el botón
        shadowColor:"black",
        shadowOffset:{width:2, height:2},
        shadowOpacity:0.5,
    }
})