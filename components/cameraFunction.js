import { CameraView, Camera } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";
import { themePalettes } from "../themeConfig";
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraFunction() {
  const themeMode = useSelector((state) => state.theme.mode);
  const accentColor = useSelector((state) => state.theme.accentColor);
  const colors =
    themePalettes(accentColor)[themeMode] || themePalettes(accentColor).light;

  const [cameraPermission, setCameraPermission] = useState();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState();
  const [facing, setFacing] = useState("back");
  const [photo, setPhoto] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [zoom, setZoom] = useState(0);
  const [shutterSound, setShutterSound] = useState(true);
  const [filter, setFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(1.0);

  const cameraRef = useRef();
  const navigation = useNavigation();

  // Request permissions
  useEffect(() => {
    (async () => {
      const cameraPerm = await Camera.requestCameraPermissionsAsync();
      const mediaPerm = await MediaLibrary.requestPermissionsAsync();
      setCameraPermission(cameraPerm.status === "granted");
      setMediaLibraryPermission(mediaPerm.status === "granted");
    })();
  }, []);

  // --- Permissions UI ---
  if (cameraPermission === undefined || mediaLibraryPermission === undefined)
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Requesting permissions...
        </Text>
      </View>
    );

  if (!cameraPermission)
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons name="camera-outline" size={48} color={colors.primary} />
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Camera permission not granted.
        </Text>
      </View>
    );

  if (!mediaLibraryPermission)
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Ionicons name="image-outline" size={48} color={colors.primary} />
        <Text style={[styles.permissionText, { color: colors.text }]}>
          Media library permission not granted.
        </Text>
      </View>
    );

  // --- Camera controls ---
  const toggleCameraFacing = () =>
    setFacing((cur) => (cur === "back" ? "front" : "back"));
  const toggleFlash = () =>
    setFlashMode((cur) => (cur === "on" ? "off" : "on"));
  const toggleShutterSound = () => setShutterSound((cur) => !cur);

  const takePic = async () => {
    try {
      const newPhoto = await cameraRef.current.takePictureAsync({
        quality: 1,
        skipProcessing: true,
        shutterSound: shutterSound,
      });
      setPhoto(newPhoto);
    } catch (err) {
      console.warn("takePic error:", err);
    }
  };

  const savePhoto = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setPhoto(null);
    } catch (err) {
      console.warn("savePhoto error:", err);
    }
  };

  const discardPhoto = () => setPhoto(null);

  // --- Crop + Rotate Tools ---
  const rotatePhoto = async () => {
    const rotated = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ rotate: 90 }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setPhoto(rotated);
  };

  const cropPhoto = async () => {
    const cropped = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ crop: { originX: 100, originY: 100, width: 500, height: 500 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    setPhoto(cropped);
  };

  // --- Filter Style ---
  const filterStyle =
    filter === "grayscale"
      ? { backgroundColor: `rgba(128,128,128,${0.5 * filterIntensity})` }
      : filter === "sepia"
      ? { backgroundColor: `rgba(112,66,20,${0.5 * filterIntensity})` }
      : null;

  // --- Preview Screen ---
  if (photo) {
    return (
      <SafeAreaView
        style={[styles.previewContainer, { backgroundColor: colors.background }]}
      >
        <View style={{ flex: 1 }}>
          <Image style={styles.preview} source={{ uri: photo.uri }} />
          {filter !== "none" && (
            <View style={[StyleSheet.absoluteFill, filterStyle]} />
          )}
        </View>

        <View style={styles.filterControls}>
          {["none", "grayscale", "sepia"].map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)}>
              <Text
                style={[
                  styles.filterButton,
                  { color: filter === f ? colors.primary : colors.text },
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filter !== "none" && (
          <Slider
            style={styles.intensitySlider}
            minimumValue={0}
            maximumValue={1}
            value={filterIntensity}
            onValueChange={setFilterIntensity}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#888"
          />
        )}

        <View style={styles.editTools}>
          <TouchableOpacity onPress={rotatePhoto}>
            <Ionicons name="refresh-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={cropPhoto}>
            <Ionicons name="crop-outline" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.previewButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={savePhoto}
          >
            <Ionicons name="save-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FF5AB8" }]}
            onPress={discardPhoto}
          >
            <Ionicons name="trash-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Camera Screen ---
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Ionicons
          name="menu"
          size={26}
          color={colors.primary}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={[styles.headerText, { color: colors.primary }]}>
          Camera
        </Text>
      </View>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flashMode}
        zoom={zoom}
        shutterSound={shutterSound}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity onPress={toggleFlash}>
              <Ionicons
                name={flashMode === "on" ? "flash-outline" : "flash-off-outline"}
                size={26}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleShutterSound}>
              <Ionicons
                name={
                  shutterSound ? "volume-high-outline" : "volume-mute-outline"
                }
                size={26}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons
                name="camera-reverse-outline"
                size={26}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <Slider
              style={styles.zoomSlider}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="#888"
              value={zoom}
              onValueChange={setZoom}
            />

            <TouchableOpacity
              onPress={takePic}
              style={[styles.captureButton, { borderColor: colors.primary }]}
            >
              <View
                style={[styles.captureInner, { backgroundColor: colors.primary }]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, paddingHorizontal: 10 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerText: {
    fontSize: 22,
    fontFamily: "DotGothic16_400Regular",
    marginLeft: 12,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  permissionText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    fontFamily: "DotGothic16_400Regular",
  },
  camera: { flex: 1, borderRadius: 20, overflow: "hidden" },
  overlay: { flex: 1, justifyContent: "space-between", padding: 20 },
  topControls: { flexDirection: "row", justifyContent: "space-between" },
  zoomSlider: { alignSelf: "center", marginBottom: 20, width: "60%" },
  bottomControls: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  captureButton: {
    borderWidth: 3,
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: { width: 60, height: 60, borderRadius: 50 },
  previewContainer: { flex: 1 },
  preview: { flex: 1, resizeMode: "contain" },
  previewButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 15,
    marginBottom: 20,
  },
  actionBtn: { padding: 15, borderRadius: 5, elevation: 4 },
  filterControls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 10,
  },
  filterButton: { fontSize: 16, fontFamily: "DotGothic16_400Regular" },
  intensitySlider: { width: "70%", alignSelf: "center", marginVertical: 10 },
  editTools: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
});