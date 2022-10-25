import React, { useContext, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function Dashboard() {

    // aqui nós pegamos a tipagem <NativeStackNavigationProp> 
    // da lib "@react-navigation/native-stack" e passamos pelo generic
    // e depois passamos um generic para a propria tipagem para
    // saber quais rotas ela tem e oq cada rota recebe como parametro
    // exemplo da tipagem como vai ficar:
    // useNavigation<NativeStackNavigationProp<StackParamsList>>()
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>()

    const [number, setNumber] = useState('')
    
    async function openOrder() {
        if (number === '') {
            return
        }

        // fazer a requisição
        const response = await api.post('/order', {
            table: Number(number),
        })

        const { id, table } = response.data

        console.log(number);
        
        //  mandar para a proxima tela.
        navigation.navigate('Order', {
            number: number,
            order_id: id
        })


        setNumber('')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>

            <TextInput
                placeholder="Numero da mesa"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                keyboardType={"numeric"}
                value={number}
                onChangeText={text => setNumber(text)}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir Mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: "#1d1d2e",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#FFF",
        marginBottom: 24,
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: "#101026",
        color: "#FFF",
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: "center",
        fontSize: 22,
    },
    button: {
        width: "90%",
        height: 40,
        backgroundColor: "#3fffa3",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginVertical: 12,
    },
    buttonText: {
        fontSize: 18,
        color: "#101026",
        fontWeight: "bold"
    }
})