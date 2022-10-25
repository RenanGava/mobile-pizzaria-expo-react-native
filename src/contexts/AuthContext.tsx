import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

interface AuthContextData {
    user: UserProps,
    isAuthenticated: Boolean,
    signIn: (credentials: SignInProps) => Promise<void>,
    loadingAuth: boolean,
    loading: boolean,
    signOut: () => void

}

interface UserProps {
    id: string,
    email: string,
    name: string,
    token: string,
}

interface AuthProviderProps {
    children: ReactNode;
}

interface SignInProps {
    email: string,
    password: string
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<UserProps>({} as UserProps)

    const [loadingAuth, setLoadingAuth] = useState(false)

    const isAuthenticated = !!user.name // assim convertemos o valor para booleano

    useEffect(() => {
        async function getUser() {

            // Pegar os dados salvos do User
            const userInfo = await AsyncStorage.getItem('@sujeitopizzaria')
            // caso der erro faça como abaixo pra criar um objeto vazio.
            let JsonParseUser: UserProps = JSON.parse(userInfo || "{}")
            // console.log(JsonParseUser);

            // Verificar se Recebemos as Informações do User
            if (Object.keys(JsonParseUser).length > 0) {
                // aqui passamos o token para a aplicaçào saber que o usuario
                // está autenticado e poder acessar as rotas que precisam
                // estar logadas.
                api.defaults.headers.common['Authorization'] = `Bearer ${JsonParseUser.token}`

                setUser({
                    id: JsonParseUser.id,
                    email: JsonParseUser.email,
                    name: JsonParseUser.name,
                    token: JsonParseUser.token
                })
            }

            setLoading(false)
        }

        getUser()
    }, [])
    
    async function signIn({ email, password }: SignInProps) {
        setLoadingAuth(true)

        try {

            const response = await api.post('/session', {
                email: email,
                password: password
            })

            // console.log(response.data);

            const { id, name, token, } = response.data

            const data = {
                ...response.data
            }

            // como o asyncstorage so aceita salvar uma string
            // precisamos converter os dados para salvar mos eles
            // no asyncstorage e para isso vamos utilizar o JSON.stringfy()
            // e passsar o data dentro dele
            await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data))

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            setUser({
                id,
                email,
                name,
                token
            })

            setLoadingAuth(false)


        } catch (err) {
            console.log('Erro ao acessar', err);
            setLoadingAuth(false)

        }
    }

    async function signOut(){
        await AsyncStorage.clear()
        .then( () =>{
            setUser({} as UserProps)
        })
    }


    return (
        <AuthContext.Provider 
            value={{
                user,
                isAuthenticated,
                signIn,
                loading,
                loadingAuth,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

