import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from 'react-native'

import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native"

import { Feather } from "@expo/vector-icons"
import { api } from '../../services/api';
import { StackParamsList } from '../../routes/app.routes';
import ModalPicker from '../../components/ModalPicker';
import { ListItem } from '../../components/ListItem';


type RouteDetailParams = {
    Order: {
        number: string | number;
        order_id: string;
    }
}

// aqui nós criamos a tipagem dá rota passando
// quais são os parametros que serão recebidos pela rota
// e também colocarmos a rota para tipar os parametro do RouteProp
type OrderRouteProps = RouteProp<RouteDetailParams, "Order">

export interface CategoryProps {
    id: string,
    name: string
}

interface ProductProps {
    id: string,
    name: string,
}

interface ItemProps {
    id: string,
    product_id: string,
    name: string,
    order_id: string,
    amount: string | number
}

export default function Order() {

    // aqui passamos a tipagem criada para o useRouter
    // saber quais parametros vai receber e passar para nossa variavel "route"
    const route = useRoute<OrderRouteProps>()
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>()

    const [category, setCategory] = useState<CategoryProps[] | []>([])
    const [categorySelected, setCategorySelected] = useState<CategoryProps>()
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelected, setProductSelected] = useState<ProductProps>()
    const [modalProdcutVisible, setModalProductVisible] = useState(false)

    const [amount, setAmount] = useState('1')
    const [items, setItems] = useState<ItemProps[]>([])

    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category')
            setCategory(response.data)
            setCategorySelected(response.data[0])
        }
        loadInfo()
    }, [])

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    category_id: categorySelected?.id
                }
            })

            setProducts(response.data)
            setProductSelected(response.data[0])
        }
        loadProducts()
    }, [categorySelected])

    async function handleCloseOrder() {
        try {
            await api.delete('/order', {
                params: {
                    order_id: route.params?.order_id
                }
            })

            // faz voltar uma página do app
            navigation.goBack()
        } catch (err) {
            console.log(err);
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item)
    }

    function handleChangeProduct(item: ProductProps) {
        setProductSelected(item)
    }

    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: route.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })

        let data = {
            id: response.data?.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name,
            order_id: route.params?.order_id,
            amount: amount
        }

        //@ts-ignore
        setItems(oldArray => [...oldArray, data])
        setAmount('1')

    }

    async function handleDeleteItem(item_id: string) {
        await api.delete('/order/item', {
            params: {
                item_id: item_id
            }
        })

        const removeItem = items.filter(item =>{
            return item.id !== item_id
        })

        setItems(removeItem)
    }

    function hanldeFinishOrder(){
        navigation.navigate('FinishOrder',{
            number: route.params?.number,
            order_id: route.params.order_id
        })
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}> Mesa {route.params.number}</Text>
                {
                    items.length === 0 && (
                        <TouchableOpacity onPress={handleCloseOrder}>
                            <Feather name='trash-2' size={28} color='#FF3F4B' />
                        </TouchableOpacity>
                    )
                }
            </View>
            {
                category.length !== 0 && (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => { setModalCategoryVisible(true) }}
                    >
                        <Text style={{ color: '#FFF' }}>
                            {
                                categorySelected?.name
                            }
                        </Text>
                    </TouchableOpacity>
                )
            }
            {
                products.length !== 0 && (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setModalProductVisible(true)}
                    >
                        <Text style={{ color: '#FFF' }}>
                            {productSelected?.name}
                        </Text>
                    </TouchableOpacity>
                )
            }

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    // da forma que fizemos aqui no style conseguimos passar
                    // mais de uma classe em linha para o componente
                    // para estiliza-lo
                    style={[styles.input, { width: ' 60%', textAlign: 'center' }]}
                    value={amount}
                    onChangeText={amount => setAmount(amount)}
                    placeholderTextColor={'#F0F0F0'}
                    keyboardType='numeric'
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.buttonAdd}
                    onPress={handleAdd}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={items.length !== 0 ? styles.button : styles.buttonDisable}
                    // no disable aquela operação vai retornar true
                    // fazendo com que assim ele entenda o valor e 
                    // desative o component
                    disabled={items.length === 0}
                    onPress={hanldeFinishOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem}/>}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    hanldeCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
                transparent={true}
                visible={modalProdcutVisible}
                animationType='fade'
            >
                <ModalPicker
                    hanldeCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#FFF",
        marginRight: 14,
    },
    input: {
        backgroundColor: "#101026",
        borderRadius: 4,
        width: "100%",
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: '#FFF',
        fontSize: 20
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    qtdText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FFF'
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: "#101026",
        fontSize: 18,
        fontWeight: "bold",
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisable: {
        backgroundColor: '#3fffa3',
        opacity: 0.5,
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    }
})