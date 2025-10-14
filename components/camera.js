// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Camera } from 'expo-camera';
// import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
// import { GLView } from 'expo-gl';

// export default function CameraPage() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       setCapturedPhoto(photo.uri);
//     }
//   };

//   const flipCamera = () => {
//     setCameraType(
//       cameraType === Camera.Constants.Type.back
//         ? Camera.Constants.Type.front
//         : Camera.Constants.Type.back
//     );
//   };

//   const manipulatePhoto = async () => {
//     if (capturedPhoto) {
//       const manipulated = await manipulateAsync(
//         capturedPhoto,
//         [{ rotate: 90 }, { resize: { width: 800 } }],
//         { compress: 0.8, format: SaveFormat.JPEG }
//       );
//       setCapturedPhoto(manipulated.uri);
//     }
//   };

//   if (hasPermission === null) {
//     return <View><Text>Requesting camera permission...</Text></View>;
//   }
//   if (hasPermission === false) {
//     return <View><Text>No access to camera</Text></View>;
//   }

//   return (
//     <View style={styles.container}>
//       {!capturedPhoto ? (
//         <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
//           <View style={styles.controls}>
//             <TouchableOpacity style={styles.button} onPress={flipCamera}>
//               <Text style={styles.text}>Flip</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={takePicture}>
//               <Text style={styles.text}>Capture</Text>
//             </TouchableOpacity>
//           </View>
//         </Camera>
//       ) : (
//         <View style={styles.preview}>
//           <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
//           <View style={styles.controls}>
//             <TouchableOpacity style={styles.button} onPress={() => setCapturedPhoto(null)}>
//               <Text style={styles.text}>Retake</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={manipulatePhoto}>
//               <Text style={styles.text}>Rotate & Resize</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//       {/* Example GLView placeholder */}
//       <GLView
//         style={{ width: 0, height: 0 }}
//         onContextCreate={(gl) => {
//           // You can use this for GPU effects in the future
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   camera: { flex: 1, justifyContent: 'flex-end' },
//   controls: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
//   button: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5 },
//   text: { color: '#fff', fontSize: 16 },
//   preview: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   capturedImage: { width: '100%', height: '80%', borderRadius: 10 },
// });
