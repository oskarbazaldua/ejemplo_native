import * as Permission from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import React, {useState} from "react";
import { StyleSheet,View, ScrollView, Alert, Dimensions} from "react-native";
import {Icon, Avatar, Image, Input, Button } from "react-native-elements";
import {map, size, filter} from "lodash";
//Extraemos el ancho de la ventana para ajustar la imagen al tamaño del dispositivo
const WidthScreen =Dimensions.get("window").width;
import uuid from "random-uuid-v4";
import {firebaseApp} from "../../utils/firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { useNavigation } from "@react-navigation/native";


const db = firebase.firestore(firebaseApp);


export default function FormSuc(toast){
    //Generamos una varible de estado para cada campo
    const [nombre, setNombre]=useState("");
    const [direccion, setDireccion]=useState("");
    const [descripcion, setDescripcion]=useState("");
    const {toastRef}=toast;
    const [imagenes, setImagenes]=useState([]);
    const navigation =useNavigation();
   

    /*Función que nos mostrará el valor de las variables de estado
    que contendrá la informaciòn de los campos del formulario*/
    const agregar= () => {
        //Verificamos que no se envíen datos vacíos
        if(!nombre|| !direccion||!descripcion) {
            //Enviamos el mensaje al cuerpo del toast para hacerlo visible
            toastRef.current.show("No puedes dejar campos vacios");
        }//Validamos contar con al menos 1 imagen
        else if(size(imagenes)=== 0){
            toastRef.current.show("La sucursal debe tener al menos 1 imagen")
        }//Si todo es correcto probaremos la carga de imágenes a Storage
        else{
            //Llamada al método encargado de subir imágenes a storage de firebase
            subirImagenesStorage()
            .then((resp)=>{
                //una vez cargadas las imágenes en el storage se procede a almacenar la sucursal
                db.collection("sucursales")
                .add({
                    //enviamos los datos a almacenar, la colección se crear por si sola
                    nombre:nombre,
                    direccion:direccion,
                    descripcion:descripcion,
                    //referenciamos las imagenes de la sucursal retornadas del storage
                    imagenes:resp,
                    rating:0,
                    ratingTotal:0,
                    votos:0,
                    creado:new Date(),
                    //para probar debes tener iniciada la sesión ya que vinculamos con el usuario
                    creadoPor: firebase.auth().currentUser.uid,
                })
                .then(()=>{
                    //si todo es correcto 
                    navigation.navigate("sucursal");
                    //toastRef.current.show("Sucursal Registrada");
                }).catch(()=>{
                    //si no es posible almacenar
                    toastRef.current.show("No es posible registrar la sucursal");
                })
            });
        }

    };

    const subirImagenesStorage = async ()=>{
        
        //arreglo que guardará las referencias a las fotos de cada sucursal
        const imagenesBlob =[];  
        await Promise.all(
            map(imagenes,async(imagen) =>{
                /*cada imagen cargada la procesamos como una petición fetch
                de carga de archivos a servidor (nuestro storage de firebase)*/
                const response = await fetch(imagen);
                //Indicamos que el tipo de archivo es blob
                const blob = await response.blob();
                /*Almacenamos cada imagen en el storage sucursales de firebase,
                el nombre de cada imagen será generado por el random de uuid*/
                const ref = firebase.storage().ref("sucursales").child(uuid());
                //Al procesar el envío indicamos una promesa que atrapará el objeto enviado 
                await ref.put(blob).then(async(resultado) =>{
                    /*Recuperamos el nombre de cada imagen almacenada para, referenciarlo 
                    al insertar la sucursal*/
                    await firebase.storage().ref(`sucursales/${resultado.metadata.name}`)
                    .getDownloadURL()
                    .then((urlFoto)=> {
                        //Cada referencia de las imagnes almacenadas las cargamos en el arreglo
                        imagenesBlob.push(urlFoto);
                    });
                });
            })
        );
        return imagenesBlob;
    };

    return(
       <ScrollView style={styles.scroll}>
        {/*Implementamos la función que nos mostrará la imagen de encabezado la cual será la primera imagen de la sucursal a registrar, para ello
        enviamos como parámetro la imagen de la posición 0 del arreglo*/}
        <ImagenPrincipal imagen={imagenes[0]}/>

        {/*El formulario de sucursales contendrá una estructura amplia
        para separarlo de la estructura general, lo separaremos de la estructura
        a través de una función Formulario*/}
        <Formulario
        /*Enviamos las funciones set que nos permitirá asignar el
        valor del formulario a las variables de estado*/
        setNombre={setNombre}
        setDireccion={setDireccion}
        SetDescripcion={setDescripcion}
        />
        {/*Agregamos la función SubirImagen*/}
        <SubirImagen 
        toastRef={toastRef} 
        imagenes={imagenes} 
        setImagenes={setImagenes}
        />
        <Button
        title="Registrar"
        buttonStyle={styles.btn}
        /*Al dar clic antivamos el mètodo agregar*/
        onPress={agregar}
        />
       </ScrollView>
    );
}

//Creamos un boton para subir una imagen
function SubirImagen(propiedades){
    const {toastRef, imagenes, setImagenes} = propiedades;
    //Creamos la función para seleccionar imágenes la cual inicia un nuevo hilo
    const seleccionar= async() => {
        //solicitamos
        const resultado=await Permission.askAsync(
            //Solicitamos permiso a la galeria
            Permission.MEDIA_LIBRARY
            //Permission.CAMERA
        );

        if(resultado==="denied"){
            toastRef.current.show("Debes permitir el acceso a la galeria", 4000);
        }
        else{
            //Accedemos a la galería, await permitirá esperar a que el usuario seleccione la imagen
            const result =await ImagePicker.launchImageLibraryAsync({
                //Permitirá editar la foto
                allowsEditing:true,
                //resolución estandar SD, marcará el tamaño de la imagen
                aspect:[4,3]
            });
            if(result.canceled){
                toastRef.current.show("Debes seleccionar una imagen",3000);
            }else{
                //Asignamos al arreglo de imágenes la nueva imagen
                setImagenes([...imagenes,result.uri]);
                //Visualizarás en consola el arreglo con las imágenes seleccionadas
                console.log(imagenes);
            }
        }
    };

    const eliminarImagen = (imagen) =>{//Recibimos la imagen a eliminar
        const copiaArreglo = imagenes;
        Alert.alert(//Alerta para confirmar eliminación
        //titulo
        "Eliminar Imagen",
        //Subtitulo
        "¿Estás seguro de que deseas eliminar la imagen?",
        [//Opciones, en este caso 2 botones cancelar y eliminar
        {
            text:"Cancelar",
            style:"cancel"
        },
        { //Si aceptamos eliminar
            text:"Eliminar",
            onPress:()=>{
                setImagenes(
                /*Extrae todas las imagenes diferentes a la que deseamos eliminar
                y sobreescribe el arreglo original sin la imagen a eliminar*/
                filter(copiaArreglo, (url)=> url !== imagen)
                );
            },
        },
    ],
    //cancelable permite definir si la alerta se cierra al dar clic en la pantalla fuera de la alerta
    {cancelable:false}
        );
};



    return(
        <View style={styles.vistaImagenes}>
            {/*Condicionamos que el icono de agregar imagen
            se oculte cuando se tengan 4 imágenes */}
            {size(imagenes)<4 &&(
            <Icon
            type="material-community"
            name="camera"
            color={"#7a7a7a"}
            containerStyle={styles.icono}
            onPress={seleccionar}
            />
            )}
            {/*Enviamos a la función map el arreglo de imágenes
            de cada posición (objeto) recupera la imagen(ruta) y
            posición del arreglo (index) que nos servirá como clave
            para no duplicar imágenes. Map recorre todas las posiciones
            del arreglo*/}
            {map(imagenes, (imagen, index)=>(
                /*Avatar nos permitirá visualizar una miniatura la imagen 
                procesada por el map*/
                <Avatar
                key={index}
                style={styles.avatar}
                source={{uri:imagen}}
                /*Llamamos a la función eliminarImagen al dar clic
                y enviamos la imagen (url) seleccionada*/
                onPress={()=> eliminarImagen(imagen)}
                />
            ))}
        </View>
    )
}

/*Función encargada de estructurar la imagen de encabezado
recibe la imagen a mostrar como parámetro*/
function ImagenPrincipal(propiedades){
    //Atrapamos la imagen a mostrar (posición 0 del arreglo)
    const {imagen} = propiedades;
    return(
        <View style={styles.foto}>
            <Image
            source={
                /*Si la imagen a mostrar existe se muestra y si no la imagen
                no-encontrada*/
                imagen ?{uri: imagen} : require('../../../assets/img/no-encontrada.png')
            }
            //Indicamos que la imagen se ajuste al ancho del dispositivo
            style={{width:WidthScreen, height:200}}
            />
        </View>
    );
}

/*Función que contiene la estructura del formulario
recibe en el apartado de propiedades las funciones ser de las variable de estado*/
function Formulario(propiedades){
    const{
        setNombre,
        setDireccion,
        SetDescripcion
    } = propiedades;

    return(
        <View style={styles.vista}>
            <Input
            placeholder="Nombre"
            containerStyle={styles.form}
            //Modificamos el valor de la variable de estado acorde a lo que el usuario escribe
            onChange={(e)=> setNombre(e.nativeEvent.text)}
            />
            <Input
            placeholder="Dirección"
            containerStyle={styles.form}
            //Modificamos el valor de la variable de estado acorde a lo que el usuario escribe
            onChange={(e)=> setDireccion(e.nativeEvent.text)}
            />
            <Input
            placeholder="Descripción"
            //Definimos múltiples líneas para convertir en un text area
            multiline={true}
            inputContainerStyle={styles.textArea}
            //Modificamos el valor de la variable de estado acorde a lo que el usuario escribe
            onChange={(e)=> SetDescripcion(e.nativeEvent.text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scroll:{
        height:"100%",
    },
    form:{
        marginLeft:10,
        marginRight:10,
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
    vistaImagenes:{
        flexDirection:"row",
        marginLeft:20,
        marginRight:20,
        marginTop:30,
    },
    icono:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:"e3e3e3",
    },
    avatar:{
        width:70,
        height:70,
        marginRight:10,
    },
});