import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaViewBase, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

export default function Camera() {
    const [cameraPermissions, setCameraPermissions] = useState();
    const [mediaLibraryPermissions, setMediaLibraryPermissions] = useState();
    const [cameraMode, setCameraMode] = useState('picture');
    const [facing, setFacing] = useState('back');
    // const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState();
    const [flashMode, setFlashMode] = useState("on");
    const [zoom, setZoom] = useState(0);
    let cameraRef = useRef();
    const navigation = useNavigation();

    useEffect(()=>{
        (async()=>{
            const cameraPermissions = await Camera.requestCameraPermissionAsync();
            const mediaLibraryPermissions = await MediaLibrary.requestPermissionsAsync();
            setCameraPermissions(cameraPermissions.status === "granted");
            setMediaLibraryPermissions(mediaLibraryPermissions.status === "granted");
        })();
    }, []);

    //permissions thingy
    if (cameraPermissions === undefined || mediaLibraryPermissions === undefined) {
        return <Text>Loading permissions...</Text>;
    } else if (!cameraPermissions) {
        return (
            <View>
                <Text>Grant me camera permission bro.</Text>
                <Button
                    title="Grant Camera Permission"
                    onPress={async () => {
                        const { status } = await Camera.requestPermissionAsync();
                        setCameraPermissions(status === "granted");
                    }}
                />
            </View>
        );
    } else if (!mediaLibraryPermissions) {
        return (
            <View>
                <Text>Grant me media library permission bro.</Text>
                <Button
                    title="Grant Media Library Permission"
                    onPress={async () => {
                        const { status } = await MediaLibrary.requestPermissionsAsync();
                        setMediaLibraryPermissions(status === "granted");
                    }}
                />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} />
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
