import React, { useEffect, useState} from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import {firebaseApp} from "../../utils/firebase"
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"
import CarouselImagenes from "../Sucursales/CarouselImagenes";
import { Rating } from "react-native-elements";
import { ListItem } from "react-native-elements";
import { Icon } from "react-native-elements";
const db = firebase.firestore(firebaseApp);
import Reviews from "../../components/Sucursales/Reviews";

//Obtenemos el ancho de la ventana del dispositivo 

const screenWidth=Dimensions.get("window").width;

export default function Sucursal(propiedades){
    //Extraemos los objetos navigation y route
    const {navigation, route}=propiedades;
    //Extraemos el id y nombre contenido en el objeto params de route
    const {id,nombre}=route.params;

    //useState para almacenar datos de la sucursal
    const[sucursal,setSucursal]=useState(null);
    //Estado para puntuación de la sucursal
    const [rating, setRating]=useState(0);

    useEffect(()=> {
        /*setOption nos permite cambiar las propiedades del stack ver_sucursales, en
        nuestro caso cambiaremos el título de la ventana con el nombre de la 
        scursal seleccionada de la lista*/
        navigation.setOptions({ title: nombre });
    }, []);

    useEffect(()=>{
        db.collection("sucursales").doc(id).get()
        .then((resp)=>{
            const datos=resp.data();
            datos.id=resp.id;
            setSucursal(datos);
        });
    },[]);

    return(
        <View style={styles.body}>
            {sucursal?(
                <ScrollView>
                    <CarouselImagenes
                    /*Enviamos la lista de imagenes de la sucursal, el ancho
                    alto que tomará el carousel */
                        arrayImages={sucursal.imagenes}
                        height={250}
                        width={screenWidth}
                    />
                    <Informacion
                        nombre={sucursal.nombre}
                        direccion={sucursal.direccion}
                        descripcion={sucursal.descripcion}
                        rating={rating}
                    />
                    {/*Incrustamos la vista de accesos a la votación
                    enviamos la navegación actual para poder regresar
                    el id de la sucursal a la que permanecen los comentarios*/}
                    <Reviews
                    navigation={navigation}
                    id={sucursal.id}
                    />
                </ScrollView>
            ):(
                <View style={styles.sucursales}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Cargando Sucursal</Text>
                </View>
            )}
        </View>
    )
    
}

function Informacion(propiedades){
    const{nombre, direccion, descripcion, rating}=propiedades;
    const listaItems =[
        //El primer elemento de la lista será nuestra dirección
        {
            text: direccion,
            iconName: "google-maps",
            iconType: "material-community",
            action:null,

        },
        //podemos agregar multiples valores como no tenemos mas datos en la bd
        ////colocaremos datos fijos para ejemplificar
        {
            text: "443 1893456",
            iconName: "phone",
            iconType: "material-community",
            action:null,
        },
        {
            text:"mail@gmail.com",
            iconName: "at",
            iconType: "material-community",
            action:null,
        },
    ];
    return(
        <View style={styles.viewSucursal}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.nombre}>{nombre}</Text>
                <Rating
                style={styles.rating}
                imageSize={20}
                readonly
                startingValue={parseFloat(rating)}
                />
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.descripcion}>{descripcion}</Text>
            </View>
            <View>
                {
                    listaItems.map((item, index)=>(
                        <ListItem key={index} containerStyle={styles.listaInfo}>
                            <Icon name={item.iconName} type={item.iconType} color="#0A6ED3"/>
                            <ListItem.Content>
                                <ListItem.Title>{item.text}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sucursales:{
        marginTop:10,
        marginBottom:10,
        alignItems: 'center',
    },
    body:{
        flex:1,
        backgroundColor:"white",
    },
    viewSucursal:{
        padding:15,
    },
    nombre:{
        fontSize:20,
        fontWeight:"bold",
    },
    descripcion:{
        marginTop:5,
        color:"grey",
    },
    direccion:{
        marginTop:5,
        color:"grey",
    },
    direccionTitulo:{
        fontWeight:"bold",
        marginTop:5,
        color:"grey",
    },
    rating:{
        position:"absolute",
        right:0,
    },
    listaInfo:{
        borderBottomColor:"#D8D8D8",
        borderBottomWidth:1,
    },
})

