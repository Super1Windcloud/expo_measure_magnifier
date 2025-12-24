import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS } from 'react-native-reanimated';

export default function MagnifierScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const zoom = useSharedValue(0);
  const [zoomDisplay, setZoomDisplay] = useState(0);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      // Adjust sensitivity as needed
      const velocity = e.velocity / 20; 
      let newZoom = zoom.value + (velocity * 0.01);
      
      // Clamp between 0 and 1
      if (newZoom < 0) newZoom = 0;
      if (newZoom > 1) newZoom = 1;
      
      zoom.value = newZoom;
      runOnJS(setZoomDisplay)(newZoom);
    });

  // Simple manual zoom controls
  const increaseZoom = () => {
    let newZoom = zoom.value + 0.1;
    if (newZoom > 1) newZoom = 1;
    zoom.value = newZoom;
    setZoomDisplay(newZoom);
  };

  const decreaseZoom = () => {
    let newZoom = zoom.value - 0.1;
    if (newZoom < 0) newZoom = 0;
    zoom.value = newZoom;
    setZoomDisplay(newZoom);
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pinch}>
        <View style={styles.cameraContainer}>
             <AnimatedCameraView 
                style={styles.camera} 
                facing="back"
                zoom={zoom}
             />
             <View style={styles.uiOverlay}>
                <Text style={styles.zoomText}>Zoom: {(zoomDisplay * 100).toFixed(0)}%</Text>
                <View style={styles.controls}>
                   <TouchableOpacity onPress={decreaseZoom} style={styles.button}>
                     <Text style={styles.buttonText}>-</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={increaseZoom} style={styles.button}>
                     <Text style={styles.buttonText}>+</Text>
                   </TouchableOpacity>
                </View>
             </View>
        </View>
      </GestureDetector>
    </View>
  );
}

const AnimatedCameraView = Animated.createAnimatedComponent(CameraView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  uiOverlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  zoomText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
  },
});
