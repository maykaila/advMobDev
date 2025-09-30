// components/playlist.js
import React, { useReducer, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const STORAGE_KEY = "spotify_clone_v1_with_history";

const initialState = {
  past: [],
  present: { playlists: [] },
  future: [],
};

// Reducer with history (undo/redo)
function reducer(state, action) {
  const { past, present, future } = state;

  switch (action.type) {
    case "ADD_PLAYLIST": {
      const playlist = {
        id: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description ?? "Custom playlist",
        songs: [],
      };
      return {
        past: [...past, present],
        present: { playlists: [...present.playlists, playlist] },
        future: [],
      };
    }
    case "REMOVE_PLAYLIST": {
      return {
        past: [...past, present],
        present: {
          playlists: present.playlists.filter((p) => p.id !== action.payload),
        },
        future: [],
      };
    }
    case "ADD_SONG": {
      const { playlistId, song } = action.payload;
      return {
        past: [...past, present],
        present: {
          playlists: present.playlists.map((p) =>
            p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
          ),
        },
        future: [],
      };
    }
    case "REMOVE_SONG": {
      const { playlistId, songId } = action.payload;
      return {
        past: [...past, present],
        present: {
          playlists: present.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
              : p
          ),
        },
        future: [],
      };
    }
    case "UNDO": {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    case "LOAD": {
      return action.payload ?? initialState;
    }
    default:
      return state;
  }
}

export default function PlaylistPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [playlistName, setPlaylistName] = useState("");
  const navigation = useNavigation();

  // Load state with history from AsyncStorage
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "LOAD", payload: JSON.parse(raw) });
    })();
  }, []);

  // Save state with history
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPlaylist = () => {
    if (!playlistName.trim()) return;
    dispatch({
      type: "ADD_PLAYLIST",
      payload: { name: playlistName.trim() },
    });
    setPlaylistName("");
    Keyboard.dismiss();
  };

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PlaylistDetail", {
          playlistId: item.id,
          playlists: state.present.playlists,
          onAddSong: (playlistId, song) =>
            dispatch({ type: "ADD_SONG", payload: { playlistId, song } }),
          onRemoveSong: (playlistId, songId) =>
            dispatch({ type: "REMOVE_SONG", payload: { playlistId, songId } }),
        })
      }
    >
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        layout={Layout.springify()}
        style={styles.playlistRow}
      >
        <Image
          source={require("../assets/nerdCat.png")}
          style={styles.playlistArt}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.playlistTitle}>{item.name}</Text>
          <Text style={styles.playlistSub}>
            {(item.songs?.length ?? 0)} songs
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            dispatch({ type: "REMOVE_PLAYLIST", payload: item.id })
          }
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with drawer toggle */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={28} color="#35DE4E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Library</Text>
      </View>

      {/* Input for playlist name */}
      <View style={styles.inputsRow}>
        <TextInput
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholder="New Playlist"
          placeholderTextColor="#35DE4E"
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addPlaylist}>
          <Text style={styles.addBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Undo / Redo controls */}
      <View style={styles.historyRow}>
        <TouchableOpacity
          style={[styles.historyBtn, state.past.length === 0 && styles.disabled]}
          onPress={() => dispatch({ type: "UNDO" })}
          disabled={state.past.length === 0}
        >
          <Text style={styles.historyText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.historyBtn, state.future.length === 0 && styles.disabled]}
          onPress={() => dispatch({ type: "REDO" })}
          disabled={state.future.length === 0}
        >
          <Text style={styles.historyText}>Redo</Text>
        </TouchableOpacity>
      </View>

      {/* Playlist list */}
      <FlatList
        data={state.present.playlists}
        keyExtractor={(p) => p.id}
        renderItem={renderPlaylist}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C07", padding: 20, paddingTop: 60 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#35DE4E",
    fontSize: 22,
    marginLeft: 10,
    fontFamily: "DotGothic16_400Regular",
  },
  inputsRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#0B0C07",
    borderWidth: 1,
    borderColor: "#35DE4E",
    color: "#35DE4E",
    padding: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: "#35DE4E",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addBtnText: { color: "#0B0C07", fontWeight: "700" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  historyBtn: {
    backgroundColor: "#35DE4E",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  historyText: { color: "#0B0C07", fontWeight: "700" },
  disabled: { opacity: 0.5 },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#070806",
  },
  playlistArt: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#35DE4E",
  },
  playlistTitle: { color: "#35DE4E", fontSize: 16 },
  playlistSub: { color: "#35DE4E", fontSize: 12, opacity: 0.8 },
  deleteText: { color: "#FF5AB8", fontSize: 18, marginLeft: 8 },
});
