import React, {useState, useEffect, useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import {View,StyleSheet} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ListaTop from "../Top/ListaTop";

const db = firebase.firestore(firebaseApp);

export default function TopSucursales(){
    //useState para arreglo de Sucursales
    const [sucursales, setSucursales]=useState([]);
    //useState para contar sucursales
    const [totalSuc, setTotalSuc]=useState(0);
    //useState para mantener el control de las sucursales a mostrar
    const [puntero, setPuntero]=useState(null);
    //definimos el acceso a las rutas de sucursales
    const navegacion=useNavigation();
    //useState de sesión
    const [usuario, setUsuario]=useState(null);
    //console.log(sucursales);
    //valimos sesión existente
    useEffect (()=>{
        firebase.auth().onAuthStateChanged((userInfo)=>{
            //si existe una sesión activa asignamos los datos de sesión al useState usuario
            setUsuario(userInfo);
        });
    },[]);

    //Visualiza nuevas sucursales regisradas
    useFocusEffect(
        useCallback(()=>{
            /*accedemos a la colección de sucursales, consultamos los registros
            con get y atrapamos la respuesta (se retorna una promesa con la lista sucursales)
            contamos y asignamos el total de sucursales al useState totalScuc*/
            db.collection("sucursales")
            .get()
            .then((res)=>{
                setTotalSuc(res.size);
            });
            const arrSucursales=[];
            db.collection("sucursales").orderBy("creado","desc").limit(10).get()
            .then((res)=>{
                setPuntero(res.docs[res.docs.length -1]);
                res.forEach((doc)=>{
                    //extraemos cada documento y lo almacenamos en un objeto sucursal
                    const sucursal =doc.data();
                    //la clave de la sucursal no asigna a menos que lo indiquemos
                    sucursal.id =doc.id;
                    //almacenamos cada sucursal en un arreglo
                    arrSucursales.push(sucursal);
                });
                //al terminar de recuperar todos los documentos los almacenamos en el useState sucursales
                setSucursales(arrSucursales);
            });
        },[])
        );

    return(
        <View style={styles.vista}>
            {/*Importamos el archivo que contendrá la lista de sucursales
            enviamos como parámetro el arreglo de sucursales*/}
            <ListaTop sucursales={sucursales}/>
        </View>
    );
}

const styles = StyleSheet.create({
    vista:{
        flex:1,
        backgroundColor:"#FFFF",
    },
})
