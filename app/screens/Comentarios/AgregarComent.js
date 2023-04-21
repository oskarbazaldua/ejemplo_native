import React, {useRef} from "react";
import {View} from "react-native";
import Toast from "react-native-easy-toast";
import FormComent from "../../components/Comentarios/FormComent";

import {firebaseApp} from "../../utils/firebase";
import firebase from 'firebase/compat/app';
import "firebase/compat/firestore";
const db = firebase.firestore(firebaseApp);


export default function AgregarComent(){
    const toastRef = useRef(); 
    return(
        <View>
            <FormComent  
            toastRef={toastRef}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
        
    );
}