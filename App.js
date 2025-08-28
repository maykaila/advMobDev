// To be improved (if u wanna continue this project):
// 1. Functions would be in a different file
// 2. Styles in a separate file
// 3. Add an update/edit function
//    3.1. make the buttons functional (eg. the useless blue square)
// 4. Design should be slayable bc design/aesthetic >>>>>>>>>>> functionality
// That is all for now. Peace out!

import React, {useState, useEffect} from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import Task from './components/task';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';

SplashScreen.preventAutoHideAsync();

export default function App() {
  //load google font
  const [loaded, error] = useFonts({
    DotGothic16_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Creating Task here !!
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask(null);
  } 

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  }

  //reason for almost crashing out
  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Just Header */}
      <View style={styles.taskWrapper}>
        <Text style={styles.header}>Your Tasks</Text>
      </View>

      {/* Tasks time!! */}
      <View style={styles.taskBox}>
        {
          taskItems.map((item, index) =>{
            return(
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item}/>
              </TouchableOpacity>
            )
          })
        }
      </View>

      {/* FIXED: needs to be fixed bc it pushes up EVERYTHINGGG */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}>

          {/* FIXED: erase the inputted text after adding task */}
          <TextInput style={styles.input} placeholder={"What to do today?"} value={task} onChangeText={text => setTask(text)}/>
          
          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>

        </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F737F',
    color: '#F9B644',
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20, 
  },
  header: {
    fontSize: 25,
    fontFamily: 'DotGothic16_400Regular',
    lineHeight: 30,
    color: '#F3D639',
    
  },
  taskBox: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#D0D0D0',
    borderRadius: 1,
    borderColor: '#565A66',
    borderWidth: 1,
    width: 250,
    fontFamily:'DotGothic16_400Regular',
  },
  addWrapper: {
    width: 45,
    height: 45,
    backgroundColor: '#D0D0D0',
    borderColor: '#565A66',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // fontFamily:'DotGothic16_400Regular',
  },
  addText: {},
});
