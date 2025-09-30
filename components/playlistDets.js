import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PlaylistDetail({ route, navigation }) {
  const { playlistId, playlists, onAddSong, onRemoveSong } = route.params;
  const playlist = playlists.find((p) => p.id === playlistId);

  const availableSongs = [
    { id: "s1", title: "Chill Vibes", artist: "DJ Sleepy" },
    { id: "s2", title: "Lofi Beats", artist: "Beat Cat" },
    { id: "s3", title: "Cat Jam", artist: "Neko Flow" },
    { id: "s4", title: "Night Walk", artist: "Synth Owl" },
  ];

  const renderLibrarySong = ({ item }) => {
    const isInPlaylist = playlist.songs.some((s) => s.id === item.id);
    return (
      <View style={styles.songRow}>
        <View style={styles.songInfo}>
          <Ionicons name="musical-notes" size={20} color="#35DE4E" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.songText}>{item.title}</Text>
            <Text style={styles.songArtist}>{item.artist}</Text>
          </View>
        </View>
        {isInPlaylist ? (
          <TouchableOpacity onPress={() => onRemoveSong(playlist.id, item.id)}>
            <Ionicons name="remove-circle" size={24} color="#FF5AB8" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onAddSong(playlist.id, item)}>
            <Ionicons name="add-circle" size={24} color="#35DE4E" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPlaylistSong = (song) => (
    <View key={song.id} style={styles.songRow}>
      <View style={styles.songInfo}>
        <Ionicons name="musical-notes" size={20} color="#35DE4E" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.songText}>{song.title}</Text>
          <Text style={styles.songArtist}>{song.artist ?? "Unknown Artist"}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemoveSong(playlist.id, song.id)}>
        <Ionicons name="trash" size={22} color="#FF5AB8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="#35DE4E" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Playlist Banner */}
        <View style={styles.banner}>
          <Image
            source={require("../assets/nerdCat.png")}
            style={styles.bannerArt}
          />
          <Text style={styles.bannerTitle}>{playlist.name}</Text>
          <Text style={styles.bannerSubtitle}>
            {playlist.songs.length} songs
          </Text>
        </View>

        {/* Songs in Playlist */}
        <Text style={styles.sectionTitle}>In this Playlist</Text>
        {playlist.songs.length === 0 ? (
          <Text style={[styles.songText, { opacity: 0.6 }]}>
            No songs yet. Add some below!
          </Text>
        ) : (
          playlist.songs.map((s) => renderPlaylistSong(s))
        )}

        {/* Available Songs */}
        <Text style={styles.sectionTitle}>Add from Library</Text>
        <FlatList
        data={availableSongs.filter(
            (s) => !playlist.songs.some((ps) => ps.id === s.id)
        )} // exclude songs already in playlist
        keyExtractor={(s) => s.id}
        renderItem={renderLibrarySong}
        scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C07", padding: 20 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#0B0C07",
    borderRadius: 50,
    padding: 6,
  },
  banner: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  bannerArt: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#35DE4E",
  },
  bannerTitle: {
    fontSize: 28,
    color: "#35DE4E",
    fontFamily: "DotGothic16_400Regular",
    marginBottom: 6,
  },
  bannerSubtitle: { color: "#35DE4E", opacity: 0.8 },
  sectionTitle: {
    fontSize: 20,
    color: "#35DE4E",
    fontFamily: "DotGothic16_400Regular",
    marginTop: 20,
    marginBottom: 10,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  songInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  songText: { color: "#35DE4E", fontSize: 16 },
  songArtist: { color: "#35DE4E", fontSize: 12, opacity: 0.7 },
});