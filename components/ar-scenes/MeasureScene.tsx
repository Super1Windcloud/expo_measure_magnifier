import React, { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroPolyline,
  ViroSphere,
  ViroAmbientLight,
  ViroNode,
  ViroMaterials,
} from "@reactvision/react-viro";

// Define materials
ViroMaterials.createMaterials({
  whiteSphere: {
    lightingModel: "PBR",
    diffuseColor: "rgb(255,255,255)",
  },
  lineStyle: {
    lightingModel: "Constant",
    diffuseColor: "rgb(255, 255, 255)",
  },
});

interface MeasureSceneProps {
  sceneNavigator?: {
    viroAppProps: {
      signalAddPoint: number;
      signalClear: number;
      signalUndo: number;
    };
  };
}

const MeasureScene = (props: any) => {
  const { sceneNavigator } = props;
  const { signalAddPoint, signalClear, signalUndo } = sceneNavigator?.viroAppProps || {};

  const [points, setPoints] = useState<number[][]>([]);
  const [cursorPosition, setCursorPosition] = useState<number[] | null>(null);
  
  // Refs to track previous signal values to detect changes
  const prevSignalAddPoint = useRef(signalAddPoint);
  const prevSignalClear = useRef(signalClear);
  const prevSignalUndo = useRef(signalUndo);

  useEffect(() => {
    // Handle Add Point Signal
    if (signalAddPoint !== prevSignalAddPoint.current) {
      prevSignalAddPoint.current = signalAddPoint;
      if (cursorPosition) {
          setPoints((currentPoints) => [...currentPoints, cursorPosition]);
      }
    }

    // Handle Clear Signal
    if (signalClear !== prevSignalClear.current) {
      prevSignalClear.current = signalClear;
      setPoints([]);
    }

    // Handle Undo Signal
    if (signalUndo !== prevSignalUndo.current) {
      prevSignalUndo.current = signalUndo;
      setPoints((currentPoints) => currentPoints.slice(0, -1));
    }
  }, [signalAddPoint, signalClear, signalUndo, cursorPosition]);

  const onCameraARHitTest = (results: any) => {
    if (results && results.hitTestResults && results.hitTestResults.length > 0) {
      // Prioritize FeaturePoint or ExistingPlaneUsingExtent
      // For now, just take the first result's position
      const hit = results.hitTestResults[0];
      // Viro's hit test returns position in `transform.position` or simply `position` depending on version.
      // Usually it's `transform.position` or `realWorldTransform`... 
      // Checking docs/common usage: results.hitTestResults[0].transform.position is standard for ReactViro.
      if (hit.transform && hit.transform.position) {
          setCursorPosition(hit.transform.position);
      } else if (hit.position) {
          // Fallback if older version
          setCursorPosition(hit.position);
      }
    } else {
      setCursorPosition(null);
    }
  };

  const calculateDistance = (p1: number[], p2: number[]) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const formatDistance = (distanceInMeters: number) => {
    const cm = distanceInMeters * 100;
    if (cm >= 100) {
      return `${distanceInMeters.toFixed(2)} m`;
    }
    return `${Math.round(cm)} cm`;
  };

  const getMidpoint = (p1: number[], p2: number[]) => {
    return [
      (p1[0] + p2[0]) / 2,
      (p1[1] + p2[1]) / 2,
      (p1[2] + p2[2]) / 2,
    ];
  };

  return (
    <ViroARScene onCameraARHitTest={onCameraARHitTest}>
      <ViroAmbientLight color="#ffffff" intensity={200} />

      {/* Render existing points */}
      {points.map((point, index) => (
        <ViroSphere
          key={`point-${index}`}
          height={0.02}
          length={0.02}
          width={0.02}
          position={point as any}
          materials={["whiteSphere"]}
        />
      ))}

      {/* Render lines and text */}
      {points.map((point, index) => {
        if (index < points.length - 1) {
          const nextPoint = points[index + 1];
          const distance = calculateDistance(point, nextPoint);
          const midpoint = getMidpoint(point, nextPoint);

          return (
            <ViroNode key={`line-group-${index}`}>
              <ViroPolyline
                position={[0,0,0]}
                points={[point, nextPoint] as any}
                thickness={0.005}
                materials={["lineStyle"]}
              />
              <ViroText
                text={formatDistance(distance)}
                position={midpoint as any}
                scale={[0.1, 0.1, 0.1]}
                style={styles.measurementText}
                transformBehaviors={["billboard"]}
              />
            </ViroNode>
          );
        }
        return null;
      })}

      {/* Render dynamic line from last point to cursor if cursor exists and we have at least one point */}
      {/* Optional: The iOS app doesn't always draw a line to the cursor until you tap, 
          but usually it shows a "ghost" line or measure. 
          Let's stick to placing points for now to keep it clean, or maybe adding a ghost line is better UX.
          The user asked for "function interface", so just placing points is the core.
      */}
      
      {/* Render a small marker at cursor position to help user know if surface is detected */}
      {cursorPosition && (
         <ViroSphere
            height={0.01}
            length={0.01}
            width={0.01}
            position={cursorPosition as any}
            materials={["whiteSphere"]}
            opacity={0.5}
         />
      )}

    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  measurementText: {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MeasureScene;
