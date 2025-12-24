import { useState } from 'react';
import { StyleSheet, Text, View, Platform, Button, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, runOnJS, useAnimatedProps } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const MAX_ZOOM_FACTOR = 5; // Maximum 5x zoom display
Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function MagnifierScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const zoom = useSharedValue(0);
  const startZoom = useSharedValue(0);
  const [zoomDisplay, setZoomDisplay] = useState(0);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startZoom.value = zoom.value;
    })
    .onUpdate((e) => {
      // Map scale to zoom value. 
      // Expo Camera zoom is 0-1. 
      // We assume a linear feel, but scale is multiplicative.
      // Let's try a simple additive approach based on scale delta for linear control 
      // OR multiplicative for natural pinch. Multiplicative is better for pinch.
      
      // However, 0 * scale is still 0. So we need to handle the case where we start at 0.
      // Let's model the "virtual" zoom level.
      // If zoom 0 = 1x and zoom 1 = MAX_ZOOM_FACTOR (e.g. 5x)
      // currentFactor = 1 + zoom * (MAX - 1)
      // newFactor = startFactor * e.scale
      // newZoom = (newFactor - 1) / (MAX - 1)
      
      const startFactor = 1 + startZoom.value * (MAX_ZOOM_FACTOR - 1);
      const newFactor = startFactor * e.scale;
      let newZoom = (newFactor - 1) / (MAX_ZOOM_FACTOR - 1);

      // Clamp
      if (newZoom < 0) newZoom = 0;
      if (newZoom > 1) newZoom = 1;

      zoom.value = newZoom;
    })
    .onEnd(() => {
      runOnJS(setZoomDisplay)(zoom.value);
    });

  const onSliderValueChange = (value: number) => {
    zoom.value = value;
    // We still update state here to keep slider UI in sync while dragging
    setZoomDisplay(value);
  };

  const animatedTextProps = useAnimatedProps(() => {
    const currentFactor = 1 + zoom.value * (MAX_ZOOM_FACTOR - 1);
    return {
      text: `${currentFactor.toFixed(1)}x`,
    } as any;
  });

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pinch}>
        <View style={styles.cameraContainer}>
             <AnimatedCameraView 
                style={styles.camera} 
                facing="back"
                zoom={zoom}
                autofocus="on"
             />
             
             {/* Bottom Control Panel */}
             <View style={styles.bottomPanel}>
               <SafeAreaView edges={['bottom']}>
                 <View style={styles.sliderContainer}>
                    <View style={styles.zoomLabelContainer}>
                      <AnimatedTextInput 
                        style={styles.zoomLabel} 
                        animatedProps={animatedTextProps} 
                        editable={false}
                        defaultValue="1.0x"
                      />
                    </View>
                    
                    <View style={styles.sliderRow}>
                      <FontAwesome name="minus-circle" size={24} color="#999" />
                      <Slider
                        style={styles.slider}
                        value={zoomDisplay}
                        onValueChange={onSliderValueChange}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="#FFD60A" // iOS Magnifier Yellow
                        maximumTrackTintColor="#333333"
                        thumbTintColor="#FFFFFF"
                      />
                      <FontAwesome name="plus-circle" size={24} color="#999" />
                    </View>
                 </View>
               </SafeAreaView>
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
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sliderContainer: {
    paddingBottom: 10,
  },
  zoomLabelContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  zoomLabel: {
    color: '#FFD60A', // iOS Magnifier Yellow
    fontSize: 24,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
});