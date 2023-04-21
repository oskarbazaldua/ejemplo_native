import React, {useState, useRef, useEffect, useCallback} from "react";
//import Focus permite ejecutar efectos secundarios cuando una pantalla esta enfocada
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
//Nos permitirá marcar la puntuación a través de estrellas 
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);


export default function ListaTopAddReview(propiedades) {
    const { navigation, route } = propiedades;
    const { id } = route.params;
    //definimos los useState para almacenar los datos de la votación
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    //Nos permitirá saber cuando ya se realizo el registro
    //y actualización de puntuación
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();


    //función que se ejecuta al enviar el comentario
    const AddReview = () => {
        //valida que se llenen todos los campos
        if (!rating) {
            toastRef.current.show("No has dado ninguna puntuación");
        } else if (!title){
            toastRef.current.show("El título es obligatorio");
        } else if (!review) {
            toastRef.current.show("El comentario es obligatorio");
        } else {
            //Si todos los datos son correctos
            setIsLoading(true);
            //recuperamos los datos del usuario logueado
            const user = firebase.auth().currentUser;
            /*creamos la estructura de los datos a almacenar sobre el comentario
            usuario, sucursal a la que pertecene el comentario, título, descripción,
            puntos y fecha de creación*/
            const datos = {
                idUser: user.uid,
                idSucursal: id,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date(),
            };
            //registramos los datos en la colección review
            
            db.collection("reviews")
                .add(datos)
                .then(()=> {
                    /*si se almacena el comentario, ejecutamos la actualización
                    del rating de la sucursal*/
                    updateSucursal();
                })
                .catch(()=> {
                    toastRef.current.show("Error al enviar la review");
                });
        }
    };

    //Función para actualizar puntos de la sucursal
    const updateSucursal = () => {
        //recuperamos el documento de la sucursal
        const sucursalRef = db.collection("sucursales").doc(id);

        sucursalRef.get().then((response) => {
            //recuperaoms los datos del documento
            const sucursalData = response.data();
            /*incrementamos el valor del campo ratingTotal con los puntos
            registrados en e nuevo comentario*/
            const ratingTotal = sucursalData.ratingTotal + rating;
            /*incrementamos en uno el número de votos realizados*/
            const votos = sucursalData.votos + 1;
            /*calculamos el promedio de puntos de la sucursal que actualizará
            el valor de las estrellas de la sucursal*/
            const ratingResult = ratingTotal / votos;

            //actualizamos el documento de la sucursal con los datos modificados 
            sucursalRef
                .update({
                    rating: ratingResult,
                    ratingTotal,
                    votos,
                })
                .then(() => {
                    //cuando se realiza la actualización se envía a la ventana anterior 
                    setIsLoading(false);
                    navigation.goBack();
                });
        });
    };

    //estructura de la ventana
    return(
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                {/*Mostrará 5 estrellas para dar la puntuación cuando marquemos las
                estrellas aparecerá el valor acorde a los puntos*/}
                <AirbnbRating
                    count={5}
                    review={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
                    defaultRating={0}
                    size={20}
                    onFinishRating={(value) => {
                        //al definir los puntos se actualiza el useState de raiting 
                        setRating(value);
                    }}
                />
            </View>
            {/*Formulario de comentarios*/}
            <View style={styles.formReview}>
                <Input
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Comentario..."
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e)=> setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={AddReview}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
    },
    viewRating:{
        height: 110,
        backgroundColor: "#f2f2f2",
    },
    formReview:{
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnContainer:{
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        backgroundColor: "#0A6ED3",
    },
});
