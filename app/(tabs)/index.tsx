import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import MeasureScene from '@/components/ar-scenes/MeasureScene';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function ARHome() {
  const [signalAddPoint, setSignalAddPoint] = useState(0);
  const [signalClear, setSignalClear] = useState(0);
  const [signalUndo, setSignalUndo] = useState(0);

  const handleAddPoint = () => {
    setSignalAddPoint((prev) => prev + 1);
  };

  const handleClear = () => {
    setSignalClear((prev) => prev + 1);
  };

  const handleUndo = () => {
    setSignalUndo((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: MeasureScene as any }}
        viroAppProps={{
          signalAddPoint,
          signalClear,
          signalUndo,
        }}
        style={styles.arNavigator}
      />

      {/* Center Reticle */}
      <View style={styles.reticleContainer} pointerEvents="none">
        <View style={styles.reticleOuter}>
          <View style={styles.reticleInner} />
        </View>
      </View>

      {/* UI Overlay */}
      <SafeAreaView style={styles.uiOverlay} pointerEvents="box-none">
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleUndo} style={styles.topButton}>
            <Ionicons name="arrow-undo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} style={styles.topButton}>
            <Text style={styles.topButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handleAddPoint} style={styles.addButton}>
            <FontAwesome name="plus" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  arNavigator: {
    flex: 1,
  },
  reticleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  reticleInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topButton: {
    padding: 10,
  },
  topButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});