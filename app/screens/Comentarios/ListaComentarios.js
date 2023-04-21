import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { size } from "lodash";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";


const db = firebase.firestore(firebase);


export default function ListaComentarios(propiedades){
    const {comentarios}=propiedades;
    return(
        <View>
            {size(comentarios)>0?(
            <FlatList         
                data={comentarios}
                renderItem={(comentarios)=><Comentarios comentarios={comentarios}/>}
                keyExtractor={(item,index)=> index.toString()}
                />
            ):(
                <View style={styles.comentarios}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Cargando Comentarios</Text>
                </View>
            )}
        </View>
    );
}

function Comentarios(propiedades){
    const {comentarios}=propiedades;
    const {hora, comentario, creadoPor} =comentarios.item;
    

    const consultarComentario = () => {
        console.log("consultando");
    };
    return(
        <TouchableOpacity onPress={consultarComentario}>
            {/*Estructura de cada item*/}
            <View style={styles.lista}>
                <View style={styles.item}>
                    <View style={styles.encabezado}>
                        <Text style={styles.hora}>{hora.toLocaleString()}</Text>
                        <Text style={styles.usuario}>Usuario: {creadoPor}</Text>
                    </View>
                        <Text style={styles.texto}>Comentario: </Text>
                        <Text style={styles.comentario}>{comentario.substring(0,60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    lista: {
        marginVertical: 10,
      },
      
      item: {
        //se define un colo blanco
        backgroundColor: '#fff',
        //bordes redondeados
        borderRadius: 5,
        //relleno de 10 puntos
        padding: 10,
        //margen horizontal de 10 puntos
        marginHorizontal: 10,
        //sombra con color negro
        shadowColor: '#000',
        //desplazamiento de 0 en el eje X y 2 en el eje Y
        shadowOffset: { width: 0, height: 2 },
        //opacidad de 0.25
        shadowOpacity: 0.25,
        //radio de la sombra de 3.84 
        shadowRadius: 3.84,
        //puntos y elevación de 5
        elevation: 5,
      },
      encabezado: {
        //disposición de elementos en fila
        flexDirection: 'row',
        //espacio entre elementos
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      hora: {
        //negritas
        fontWeight: 'bold',
        //tamaño
        fontSize: 16,
      },
      usuario: {
        fontSize: 16,
      },
      texto: {
        fontWeight: 'bold',
        fontSize: 16,
        //margen inferior de 5
        marginBottom: 5,
      },
      comentario: {
        fontSize: 16,
      },
      comentarios:{
        marginTop:10,
        marginBottom:10,
        alignItems: 'center',
        }
});