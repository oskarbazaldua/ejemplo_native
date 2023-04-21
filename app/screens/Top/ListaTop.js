import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity} from "react-native";
import { Image, Rating } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";


export default function ListaTop(propiedades){
    const {sucursales}=propiedades;
    return(
        <View>
            {size(sucursales)>0?(
                <FlatList
                data={sucursales}
                renderItem={(sucursales)=> <Sucursales sucursales={sucursales}/>}
                keyExtractor={(item,index)=> index.toString()}
                />
            ):(
                <View style={styles.sucursales}>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text>Cargando Top</Text>
                </View>
            )}
        </View>
    );
}

function Sucursales(propiedades){
    //Recibe la lista de sucursales
    const {sucursales} = propiedades;
    //en cada iteración obtiene los datos de la sucursal
    const {imagenes,nombre, rating, id} = sucursales.item;
    //definimos el acceso a las rutas de sucursales
    const navegacion=useNavigation();

    //Método que se ejecutará al dar clic a los items de la lista
    const consultarRestaurante = () => {
        navegacion.navigate("top",{id,nombre});
    };


    return(
        //Agregamos el clic a cada item al dar clic el item se opaca
        <TouchableOpacity onPress={consultarRestaurante}>
            {/*Estructura de cada item*/}
            <View style={styles.lista}>
                <View style={styles.viewImagen}>
                    {/*cover escala la imagen de forma uniforme para evitar distorsión
                    PlaceholderContent mostrará un spiner si tarda la carga de imagen
                    sorce define que se mostrará la imagen 0 del arreglo de imágenes guardadas,
                    sí no hay imagen, se muestra la imagen de no-encontrado cargada en el proyecto*/}
                    <Image
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator color="#0000ff"/>}
                    source={imagenes[0] ? {uri: imagenes[0] }: require("../../../assets/img/no-encontrada.png")}
                    style={styles.imagen}
                    />
                </View>
                {/*Mostramos los datos adicionales de la sucursal, en caso de la descripción, dado que pude ser 
                larga, limitaremos el texto a mostrar*/}
                <View style={styles.viewReview}>
                <View>
                    <Text style={styles.nombre}>{nombre}</Text>
                    <Rating style={{marginTop:10}} imageSize={15} startingValue={rating} readonly/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}



const styles=StyleSheet.create({
    sucursales:{
        marginTop:10,
        marginBottom:10,
        alignItems:'center',
    },
    lista:{
        flexDirection:"row",
        margin:10
    },
    viewImagen: {
        marginRight:15
    },
    imagen: {
        width:80,
        height:80
    },
    nombre: {
        fontWeight:"bold"
    },
    viewReview:{
        flexDirection:"row",
        padding:10,
        paddingBottom:20,
        borderBottomColor: "#0A6ED3",
        borderBottomWidth:1,
    }, 
});