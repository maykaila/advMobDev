import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, FlatList, Text, TextInput, TouchableOpacity, View, Keyboard, Image } from 'react-native';
import Task from './task';
import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';
import * as SecureStore from 'expo-secure-store';

export default function Homepage({navigation}) {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // SecureStore helpers
  const save = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  };

  const load = async (key) => {
    const result = await SecureStore.getItemAsync(key);
    return result ?? null;
  };

  // Load fonts
  const [loaded, error] = useFonts({
    DotGothic16_400Regular,
  });

  // Load saved tasks on mount
  useEffect(() => {
    (async () => {
      const saved = await load('tasks');
      if (saved) {
        setTaskItems(JSON.parse(saved));
      }
    })();
  }, []);

  // Save tasks when updated
  useEffect(() => {
    save('tasks', JSON.stringify(taskItems));
  }, [taskItems]);

  // Add new task
  const handleAddTask = () => {
    if (!task.trim()) return; // ignore empty tasks
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask('');
  };

  // Complete / delete task
  const completeTask = (index) => {
    const updatedTasks = [...taskItems];
    updatedTasks.splice(index, 1);
    setTaskItems(updatedTasks);
  };

  // Prevent rendering until fonts are ready
  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.taskWrapper}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} >
          <Image source={require('../assets/nerdCat.png')} style={styles.nerd} />
        </TouchableOpacity>
        <Text style={styles.header}>Your Tasks</Text>
      </View>

      {/* Task List */}
      <View style={styles.taskBox}>
        <FlatList
          data={taskItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => completeTask(index)}>
              <Task text={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder="What to do today?"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={handleAddTask}>
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
    backgroundColor: '#0B0C07',
  },
  taskWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nerd: {
    height: 30,
    width: 30,
  },
  header: {
    fontSize: 25,
    fontFamily: 'DotGothic16_400Regular',
    lineHeight: 30,
    color: '#35DE4E',
    paddingLeft: 10,
  },
  settingView: {
    width: '60%',
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  settings: {
    height: 30,
    width: 30,
  },
  taskBox: {
    marginTop: 20,
    maxHeight: '70%',
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
    backgroundColor: '#35DE4E',
    borderRadius: 1,
    borderColor: '#0B0C07',
    borderWidth: 1,
    width: 250,
    fontFamily: 'DotGothic16_400Regular',
  },
  addWrapper: {
    width: 45,
    height: 45,
    backgroundColor: '#35DE4E',
    borderColor: '#0B0C07',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  addText: {
    fontSize: 20,
    fontFamily: 'DotGothic16_400Regular',
    lineHeight: 30,
    color: '#0B0C07',
  },
});
