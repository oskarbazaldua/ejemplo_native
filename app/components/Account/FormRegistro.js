import React, {useState} from "react";
import {StyleSheet, View, TouchableOpacity, Text} from "react-native";
import { Input,Icon, Button } from "react-native-elements";
import { validarEmail } from "../../utils/validaciones";
import {size, isEmpty} from "lodash";
import firebase from 'firebase/compat/app';
import { useNavigation } from "@react-navigation/native";
//import DropDownPicker from 'react-native-dropdown-picker';


import { firebaseApp } from "../../utils/firebase";
import 'firebase/compat/auth';

const db = firebase.firestore(firebaseApp);



export default function FormRegistro(toast){
    const navigation =useNavigation();
    //declaramos el objeto que manipulará el toast
    const {toastRef}=toast;
    const [mostrar, setMostrar]=useState(false);
    const [mostrarRepetir, setRepetir]=useState(false);
    const [selectedButton, setSelectedButton] = useState(null);

    
    /*El estado datos almacenará los datos del formulario
    por default se inicializa con los campos creados 
    en la funcion valoresDefault*/
    const [datos, setDatos]=useState(valoresDefault);
    /*Metodo que se ejecutará a dar clic en el botón
    nos permitirá por el momento verificar en consola
    los datos recuperados del formulario*/

    
    const handleButtonPress = (buttonName) => {
    setSelectedButton(buttonName);
}



    const onSubmit = () => {
        //Verificamos que no se envíen datos vacios 
        if(isEmpty(datos.email) || isEmpty(datos.password) || isEmpty(datos.repeatedPassword)) {
            //Enviamos el mensaje cuerpo del toast para hacerlo visible
            toastRef.current.show("No puede dejar campos vacios");
        }//Validamos la estructura del email
        else if(!validarEmail(datos.email)){
            toastRef.current.show("Estructura del email incorrecta");
        }//Validamos que la contraseña tenga al menos 6  caracteres
        else if(size(datos.password)<6){
            toastRef.current.show("La conraseña debe tener al menos 6 caracteres");
        }//Validamos que las contraseñas sean iguales
        else if(datos.password != datos.repeatedPassword){
            toastRef.current.show("Las contraseñas deben ser iguales");
        }else if(selectedButton === null){
            toastRef.current.show("Debe seleccionar un rol");
        }//Si todo es correcto visualizaremos los datos
        else {
            firebase.auth().createUserWithEmailAndPassword(datos.email, datos.password)
            .then((userCredential) => {
              const user = userCredential.user;
              firebase.firestore().collection("usuarios").doc(user.uid).set({
                email: user.email,
                role: selectedButton,
              }).then(() => {
                        navigation.navigate("cuentas");
                    });
                })
                .catch(err => {
                    console.log(err);
                    toastRef.current.show("El correo electrónico ya está en uso, intenta con un correo diferente");
                });
        }
    };
    /*Método que se activará al escribir en los campos
    del fomulario:
    e -> Contiene los datos del evento
    type -> El nombre del campo que se actualizara en el estado*/
    const onChange = (e, type) => {
        /*
        ...datos -> Indica que se actualizarán los campos 
        que contiene el estado "datos" de como se crearon en
        la función valoresDeafult son email, password y repeatPassword
        [type] -> Permite recuperar el nombre del campo que se modificará.
        e.nativeEvent.text -> Recupera el texto input*/
        setDatos({...datos, [type]:e.nativeEvent.text});
        
    };
    return (
    <View style={styles.formContainer}>
        <View style={{ flexDirection: 'row', flex:1 }}>
            <TouchableOpacity
            style={{
                backgroundColor: selectedButton === 'admin' ? 'blue' : 'gray',
                padding: 10,
                borderRadius: 5,
                margin: 10,
                width: 100,
            }}
                onPress={() => handleButtonPress('admin')}
            >
            <Text style={{ color: 'white', textAlign: 'center' }}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={{
                backgroundColor: selectedButton === 'security' ? 'blue' : 'gray',
                padding: 10,
                borderRadius: 5,
                margin: 10,
                width: 100,
            }}
                onPress={() => handleButtonPress('security')}
            >
            <Text style={{ color: 'white', textAlign: 'center' }}>Seguridad</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: selectedButton === 'user' ? 'blue' : 'gray',
                    padding: 10,
                    borderRadius: 5,
                    margin: 10,
                    width: 100,
                }}
                    onPress={() => handleButtonPress('user')}
                >
                <Text style={{ color: 'white', textAlign: 'center' }}>Vecino</Text>
            </TouchableOpacity>
        </View>
            

            
            <Input
            placeholder="Correo Electrónico" 
            containerStyle={styles.inputForm}
            /*Al escribir en el campo se activa el evento y
            procedemos a enviar al metodo onChange en el eento y
            el campo a modificar*/
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
            /*Si mostrar es false se oculta el texto
            de lo contrario se muestra*/
            secureTextEntry={mostrar?false:true}
            /*Al escribir en el campo se activa el evento y
            procedemos a enviar al metodo onChange en el eento y
            el campo a modificar*/
            onChange={(e)=> onChange(e,"password")}
            rightIcon={
                <Icon
                type="material-community-icon"
                /*Si mostrar es false se muestra el icono
                de ocultar contraseá, de lo contrario se muestra
                el icono de ver contraseña*/
                name={mostrar?"visibility":"visibility-off"}
                iconStyle={styles.icono}
                onPress={() => setMostrar(!mostrar)}
                />
            }
            />
            <Input
            placeholder="Repetir Contraseña"
            containerStyle={styles.inputForm}
            password={true}
            secureTextEntry={mostrarRepetir?false:true}
            /*Al escribir en el campo se activa el evento y
            procedemos a enviar al metodo onChange en el eento y
            el campo a modificar*/
            onChange={(e)=> onChange(e,"repeatedPassword")}
            rightIcon={
                <Icon
                type="material-community-icon"
                name={mostrar?"visibility":"visibility-off"}
                iconStyle={styles.icono}
                onPress={() => setRepetir(!mostrarRepetir)}
                />
            }
            />
            <Button
            title="Registrar"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            /*Al dar clic activamos el método onSubmit*/
            onPress={onSubmit}
            />
        </View>
    )}

function valoresDefault(){
    return{
        email:"",
        password:"",
        repeatedPassword:"",
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
        color:"#c1c1c1",
    },
})