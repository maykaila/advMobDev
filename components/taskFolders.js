// components/taskFolders.js
import React, { useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Keyboard,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "taskFolders_v1";

const initialState = { tasks: [], past: [], future: [] };

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK": {
      const item = { id: Date.now().toString(), name: action.payload.name, folder: action.payload.folder };
      const newTasks = [...state.tasks, item];
      return { tasks: newTasks, past: [...state.past, state.tasks], future: [] };
    }
    case "REMOVE_TASK": {
      const newTasks = state.tasks.filter(t => t.id !== action.payload);
      return { tasks: newTasks, past: [...state.past, state.tasks], future: [] };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      return { tasks: previous, past: newPast, future: [state.tasks, ...state.future] };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { tasks: next, past: [...state.past, state.tasks], future: rest };
    }
    case "LOAD": {
      return action.payload ?? initialState;
    }
    case "CLEAR_ALL": {
      return { tasks: [], past: [...state.past, state.tasks], future: [] };
    }
    default:
      return state;
  }
}

export default function TaskFolders() {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskText, setTaskText] = useState("");
  const [folderText, setFolderText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) dispatch({ type: "LOAD", payload: JSON.parse(raw) });
      } catch (e) {
        console.warn("Failed to load task folders", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Failed to save task folders", e);
      }
    })();
  }, [state]);

  const addTask = () => {
    if (!taskText.trim() || !folderText.trim()) return;
    dispatch({ type: "ADD_TASK", payload: { name: taskText.trim(), folder: folderText.trim() } });
    setTaskText("");
    Keyboard.dismiss();
  };

  const grouped = state.tasks.reduce((acc, t) => {
    if (!acc[t.folder]) acc[t.folder] = [];
    acc[t.folder].push(t);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={styles.menuBtn}>
          <Image source={require('../assets/folderIcon.png')} style={styles.folder} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Folders</Text>
      </View>

      {/* inputs */}
      <TextInput
        value={taskText}
        onChangeText={setTaskText}
        placeholder="Task name"
        placeholderTextColor="#35DE4E"
        style={styles.input}
      />
      <TextInput
        value={folderText}
        onChangeText={setFolderText}
        placeholder="Folder name (category)"
        placeholderTextColor="#35DE4E"
        style={styles.input}
      />
      <View style={styles.row}>
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={() => dispatch({ type: "CLEAR_ALL" })}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* grouped lists */}
      <FlatList
        data={Object.keys(grouped)}
        keyExtractor={(k) => k}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item: folderName }) => (
          <View style={styles.folderCard}>
            <Text style={styles.folderTitle}>{folderName}</Text>
            {grouped[folderName].map((t) => (
              <View key={t.id} style={styles.taskRow}>
                <Text style={styles.taskText}>{t.name}</Text>
                <TouchableOpacity onPress={() => dispatch({ type: "REMOVE_TASK", payload: t.id })}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />

      {/* undo/redo */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => dispatch({ type: "UNDO" })}>
          <Text style={styles.ghostBtnText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostBtn} onPress={() => dispatch({ type: "REDO" })}>
          <Text style={styles.ghostBtnText}>Redo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#0B0C07", 
        paddingHorizontal: 20, 
        paddingTop: 80 
    },
    headerRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 20 
    },
    folder: {
        height: 30,
        width: 30,
    },
    menuBtn: { 
        padding: 6 
    },
    headerTitle: { 
        color: "#35DE4E", 
        fontSize: 24, 
        marginLeft: 12, 
        lineHeight: 30,
        fontFamily: "DotGothic16_400Regular" 
    },
    input: {
        backgroundColor: "#0B0C07",
        borderWidth: 1,
        borderColor: "#35DE4E",
        color: "#35DE4E",
        padding: 15,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        marginBottom: 20,
        fontFamily: "DotGothic16_400Regular",
    },
    row: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        marginBottom: 12 
    },
    addBtn: { 
        backgroundColor: "#35DE4E", 
        paddingVertical: 10, 
        paddingHorizontal: 16, 
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4 
    },
    addBtnText: { 
        color: "#0B0C07", 
        fontWeight: "700" 
    },
    clearBtn: { 
        borderColor: "#FF5AB8", 
        borderWidth: 1, 
        paddingVertical: 10, 
        paddingHorizontal: 12, 
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4 
    },
    clearBtnText: { 
        color: "#FF5AB8", 
        fontWeight: "700" 
    },
    folderCard: { 
        borderWidth: 1, 
        borderColor: "#35DE4E", 
        padding: 12, 
        borderRadius: 4, 
        marginBottom: 12, 
        backgroundColor: "#0B0C07" 
    },
    folderTitle: { 
        color: "#35DE4E", 
        fontSize: 16, 
        marginBottom: 8, 
        fontFamily: "DotGothic16_400Regular" 
    },
    taskRow: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingVertical: 8, 
        borderTopWidth: 1, 
        borderTopColor: "#0B0C07" 
    },
    taskText: { 
        color: "#35DE4E", 
        maxWidth: "85%", 
        fontFamily: "DotGothic16_400Regular" 
    },
    deleteIcon: { 
        color: "#FF5AB8", 
        fontSize: 18, 
        paddingHorizontal: 8 
    },
    footerRow: { 
        position: "absolute", 
        bottom: 40, 
        left: 20, 
        right: 20, 
        flexDirection: "row", 
        justifyContent: "space-between" 
    },
    ghostBtn: { 
        borderWidth: 1, 
        borderColor: "#35DE4E", 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 4, 
        backgroundColor: "transparent" 
    },
    ghostBtnText: { 
        color: "#35DE4E", 
        fontWeight: "700" 
    },
});
