import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { themePalettes } from "../themeConfig";

export default function PlaylistDetail({ route, navigation }) {
  const { playlistId, playlists, onAddSong, onRemoveSong } = route.params;
  const playlist = playlists.find((p) => p.id === playlistId);

  // theme setup
  const themeMode = useSelector((s) => s.theme.mode);
  const accentColor = useSelector((s) => s.theme.accentColor);
  const colors = themePalettes(accentColor)[themeMode];

  const availableSongs = [
    { id: "s1", title: "Chill Vibes", artist: "DJ Sleepy" },
    { id: "s2", title: "Lofi Beats", artist: "Beat Cat" },
    { id: "s3", title: "Cat Jam", artist: "Neko Flow" },
    { id: "s4", title: "Night Walk", artist: "Synth Owl" },
  ];

  const renderLibrarySong = ({ item }) => {
    const isInPlaylist = playlist.songs.some((s) => s.id === item.id);
    return (
      <View style={[styles.songRow, { borderBottomColor: colors.card }]}>
        <View style={styles.songInfo}>
          <Ionicons name="musical-notes" size={20} color={colors.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.songText, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.songArtist, { color: colors.text }]}>{item.artist}</Text>
          </View>
        </View>
        {isInPlaylist ? (
          <TouchableOpacity onPress={() => onRemoveSong(playlist.id, item.id)}>
            <Ionicons name="remove-circle" size={24} color={colors.danger} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onAddSong(playlist.id, item)}>
            <Ionicons name="add-circle" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPlaylistSong = (song) => (
    <View key={song.id} style={[styles.songRow, { borderBottomColor: colors.card }]}>
      <View style={styles.songInfo}>
        <Ionicons name="musical-notes" size={20} color={colors.primary} />
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.songText, { color: colors.text }]}>{song.title}</Text>
          <Text style={[styles.songArtist, { color: colors.text }]}>{song.artist ?? "Unknown Artist"}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemoveSong(playlist.id, song.id)}>
        <Ionicons name="trash" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButton, { backgroundColor: colors.card }]}
      >
        <Ionicons name="arrow-back" size={28} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Playlist Banner */}
        <View style={styles.banner}>
          <Image
            source={require("../assets/nerdCat.png")}
            style={[styles.bannerArt, { borderColor: colors.primary }]}
          />
          <Text style={[styles.bannerTitle, { color: colors.primary }]}>{playlist.name}</Text>
          <Text style={[styles.bannerSubtitle, { color: colors.text }]}>
            {playlist.songs.length} songs
          </Text>
        </View>

        {/* Songs in Playlist */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>In this Playlist</Text>
        {playlist.songs.length === 0 ? (
          <Text style={[styles.songText, { opacity: 0.6, color: colors.text }]}>
            No songs yet. Add some below!
          </Text>
        ) : (
          playlist.songs.map((s) => renderPlaylistSong(s))
        )}

        {/* Available Songs */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Add from Library</Text>
        <FlatList
          data={availableSongs.filter(
            (s) => !playlist.songs.some((ps) => ps.id === s.id)
          )}
          keyExtractor={(s) => s.id}
          renderItem={renderLibrarySong}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  backButton: { 
    position: "absolute", 
    top: 40, 
    left: 20, 
    zIndex: 10, 
    borderRadius: 50, 
    padding: 6 
  },
  banner: { 
    alignItems: "center", 
    marginTop: 60, 
    marginBottom: 30 
  },
  bannerArt: { 
    width: 140, 
    height: 140, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1 
  },
  bannerTitle: { 
    fontSize: 28, 
    fontFamily: "DotGothic16_400Regular", 
    marginBottom: 6 
  },
  bannerSubtitle: { 
    opacity: 0.8, 
    fontFamily: "DotGothic16_400Regular" 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontFamily: "DotGothic16_400Regular", 
    marginTop: 20, 
    marginBottom: 10 
  },
  songRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  songInfo: { 
    flexDirection: "row", 
    alignItems: "center", 
    flex: 1 
  },
  songText: { 
    fontSize: 16, 
    fontFamily: "DotGothic16_400Regular" 
  },
  songArtist: { 
    fontSize: 12, 
    opacity: 0.7, 
    fontFamily: "DotGothic16_400Regular" 
  },
});
