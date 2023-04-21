import React, {useState} from "react";
import {StyleSheet, View, Text} from "react-native";
import { Input,Icon, Button } from "react-native-elements";
import {validarEmail} from "../../utils/validaciones";
import {size, isEmpty} from "lodash";
import firebase from 'firebase/compat/app';
import {useNavigation} from "@react-navigation/native";

export default function FormLogin(toast){
    const navigation = useNavigation();
    const {toastRef}=toast;
    const [mostrar, setMostrar]=useState(false);
    const [datos2, setDatos2]=useState(valoresDefault);
    const onSubmit = () => {
        if(isEmpty(datos2.email) || isEmpty(datos2.password)){
            toastRef.current.show("No se puede dejar campos vacios");
        }
        else if(!validarEmail(datos2.email)){
            toastRef.current.show("Estructura del email incorrecta");
        }
        else if(size(datos2.password)<6){
            toastRef.current.show("La contraseña debe tener al menos 6 caracteres");
        }else{
            //falta agreagar el navigation para que pueda acceder entre páginas 
            firebase.auth().signInWithEmailAndPassword(datos2.email,datos2.password)
            .then(respuesta =>{
                navigation.navigate("cuentas");
            })
            .catch(err=>{
                toastRef.current.show("Email o contraseña incorrecta");
               // console.log(err);
            });
        }
    }

    const onChange = (e, type) =>{
        setDatos2({...datos2, [type]:e.nativeEvent.text});
    };
    return(
        <View style={styles.formContainer}>
            <Input
            placeholder="Correo Electrónico" 
            containerStyle={styles.inputForm}
            onChange={(e)=> onChange(e,"email")}
            rightIcon={
                <Icon
                type="material-community-icon"
                name="alternate-email"
                iconStyle={styles.icono}
                />
            }
            />
            <Input
            placeholder="Contraseña"
            containerStyle={styles.inputForm}
            password={true}
            secureTextEntry={mostrar?false:true}
            onChange={(e)=> onChange(e,"password")}
            rightIcon={
                <Icon
                type="material-community-icon"
                name={mostrar?"visibility":"visibility-off"}
                iconStyle={styles.icono}
                onPress={()=> setMostrar(!mostrar)}
                />
            }
            />
            <Button
            title="Iniciar Sesión"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={onSubmit}
            />
        </View>
    )}

    function valoresDefault(){
        return{
            email:"",
            password:"",
        };
    }

    const styles = StyleSheet.create({
        formContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputForm: {
            width:"100%",
            marginTop:20,
        },
        btnContainer: {
            marginTop:20,
            width:"100%",
        },
        btn:{
            backgroundColor:"#0A6ED3",
        },
        icono: {
            color:"c1c1c1",
        },
    })