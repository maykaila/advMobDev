import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Task = (props) => {
    return(
        <View style={styles.item}>
            <View style={styles.actualTask}>
                <View style={styles.checkbox}></View>
                <Text style={styles.text}>{props.text}</Text>
            </View>
            {/* <View style={styles.uselessThing}></View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#D6D6D6',
        borderColor: '#565A66',
        borderWidth: 1,
        marginLeft: 15,
        marginRight: 15,
        padding: 15, 
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actualTask: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        fontFamily:'DotGothic16_400Regular',
    },
    checkbox: {
        width: 24,
        height: 24,
        backgroundColor: '#298CDE',
        borderRadius: 1,
        marginRight: 15,
    },
    text: {
        maxWidth: '80%',
        lineHeight: 24,
        fontFamily:'DotGothic16_400Regular',
    },
    // uselessThing: {
    //     width: 12,
    //     height: 12,
    //     borderColor: '#EF5A5A',
    //     borderWidth: 2,
    //     borderRadius: 2,
    // },
});

export default Task;