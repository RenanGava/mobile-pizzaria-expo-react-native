import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Dashboard from "../pages/Dashboard"
import Order from "../pages/Order"
import FinishOrder  from "../pages/FinishOrder"


// temos que criar essa tipagem para
// o typescript entender na hora de navegar entre as páginas
export type  StackParamsList = {
    Dashboard: undefined;
    Order: {
        number: number | string;
        order_id: string
    },
    FinishOrder: {
        number: string | number;
        order_id: string
    }
}

// instanciamos o StackNavigator para utilizar ele
// como um componente e gerenciar as rotas autenticadas
const Stack = createNativeStackNavigator<StackParamsList>()


function AppRoutes() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Dashboard" 
                component={Dashboard} 
                options={{headerShown: false}}
            />
            <Stack.Screen 
                name="Order" 
                component={Order} 
                options={{headerShown: false}}
            />
            <Stack.Screen 
                name="FinishOrder"
                component={FinishOrder}
                options={{
                    title: 'Finalizando',
                    headerStyle:{
                        backgroundColor: '#1d1d2e'
                    },
                    headerTintColor: '#FFF'
                }}
            />
        </Stack.Navigator>
    )
}

export default AppRoutes