// Ga suha duha ko kung i remove ba ni nako or di
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

const Task = (props) => {
  const [isChecked, setChecked] = useState(false);

  return(
    <View style={[styles.item, isChecked && styles.itemChecked]}>
      <View style={styles.actualTask}>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#35DE4E' : undefined}
        />
        <Text style={[styles.text, isChecked && styles.textChecked]}>
          {props.text}
        </Text>
      </View>
      <View style={styles.uselessThing}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#0B0C07',
    borderColor: '#35DE4E',
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
    borderColor: '#35DE4E',
    borderRadius: 1,
    marginRight: 15,
  },
  text: {
    flexShrink: 1,
    lineHeight: 24,
    color: '#35DE4E',
    fontFamily: 'DotGothic16_400Regular',
  },
  textChecked: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  uselessThing: {
    width: 12,
    height: 12,
    borderColor: '#FF5AB8',
    borderWidth: 2,
    borderRadius: 2,
  },
  itemChecked: {
    opacity: 0.6,
  },
});

export default Task;