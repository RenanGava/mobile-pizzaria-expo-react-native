import React from 'react'
import { 
    View, 
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'
import { CategoryProps } from '../../pages/Order'

interface ModalPickerProps{
    options: CategoryProps[]
    hanldeCloseModal: () => void
    selectedItem: (item: CategoryProps) => void
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export default function ModalPicker({ hanldeCloseModal, options, selectedItem }: ModalPickerProps) {
    
    function onPressItem(item: CategoryProps){
        selectedItem(item)
        hanldeCloseModal()
        
    }

    const option = options.map((item, index) => {
        return(
            <TouchableOpacity 
                key={index} 
                style={styles.option}
                onPress={ () => onPressItem(item)}
            >
                <Text style={styles.item}>
                    {item?.name}
                </Text>
            </TouchableOpacity>
        )
    })

    return(
        <TouchableOpacity 
            style={styles.container}
            onPress={hanldeCloseModal}
        >
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: 'center' 
    },
    content:{
        width: WIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#8a8a8a",
        borderRadius: 4
    },
    option:{
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: "#8a8a8a",
    },
    item:{
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#101026'
    }
})