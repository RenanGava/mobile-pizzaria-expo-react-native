import React, { useContext, useState } from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from "react-native"
import { AuthContext } from '../../contexts/AuthContext'


export default function SignIn(){

    // lembrar de sempre instalar o react-devtools
    // para debugar app mobile yarn expo install react-devtools
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, loadingAuth } = useContext(AuthContext)

    async function handleLogin() {

        if(email === '' || password === ''){
            return
        }

        await signIn({email, password})
        
        
    }

    return(
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Digite seu email'
                    style={styles.input}
                    placeholderTextColor="#F0F0F0"
                    value={email}
                    onChangeText={ email => setEmail(email)}
                />
                <TextInput 
                    placeholder='Digite sua senha'
                    style={styles.input}
                    placeholderTextColor="#F0F0F0"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={ password => setPassword(password)}
                />
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleLogin}
                >
                    {loadingAuth ? (
                    <ActivityIndicator size={25} color="#fff"/>
                    ):(
                        <Text style={styles.buttonText}> Acessar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1d1d2e"
    },
    logo:{
        marginBottom: 18,
    },
    inputContainer:{
        width: "95%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 34,
        paddingHorizontal: 14,
    },
    input:{
        width: "95%",
        height: 40,
        backgroundColor: "#101026",
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: "#F0F0F0",
    },
    button:{
        width: "95%",
        height: 40,
        backgroundColor: "#3fffa3",
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: "center",

    },
    buttonText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "#101026"
    }
})