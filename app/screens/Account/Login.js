import React, {useRef} from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import {Divider} from "react-native-elements";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import FormLogin from "../../components/Account/FormLogin";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-easy-toast'; 



export default function Login(){
    const toastRef=useRef();
    return(
        <KeyboardAwareScrollView>
            <Image
                source={require("../../../assets/img/user.png")}
                resizeMethod="auto"
                style={styles.usuario}
            />
            <View style={styles.formulario}>
                <FormLogin toastRef={toastRef}/>
                <CrearCuenta/>
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Divider style={styles.divider} />
        </KeyboardAwareScrollView>
    );
}


function CrearCuenta(){
    const navegacion = useNavigation();
    return(
        <Text style={styles.textRegistrar}>
            ¿Aun no tienes cuenta?{""}
        <Text
        style={styles.link}
        onPress={()=>navegacion.navigate("Registrar")}
        >
            Regístrate
        </Text>
        </Text>
    );

}

const styles = StyleSheet.create({
    usuario:{
        width:"100%",
        height:150,
        marginTop:20,
    },
    contenedor:{
        marginRight:40,
        marginLeft:40,
    },
    textRegistrar:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    },
    link:{
        color:"#0A6ED3",
        fontWeight:"bold",
    },
    divider:{
        backgroundColor:"#0A6ED3",
        margin:40,
    },
    imagen:{
        width:"100%",
        height:150,
        marginTop:20,
    },
    formulario:{
        marginTop:40,
        marginLeft:40,
        marginRight:40,
    },
})