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

interface Segment {
  start: number[];
  end: number[];
}

const MeasureScene = (props: any) => {
  const { sceneNavigator } = props;
  const { signalAddPoint, signalClear, signalUndo } = sceneNavigator?.viroAppProps || {};

  const [segments, setSegments] = useState<Segment[]>([]);
  const [activeStartPoint, setActiveStartPoint] = useState<number[] | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number[] | null>(null);
  
  // Refs to track previous signal values
  const prevSignalAddPoint = useRef(signalAddPoint);
  const prevSignalClear = useRef(signalClear);
  const prevSignalUndo = useRef(signalUndo);

  useEffect(() => {
    // Handle Add Point Signal
    if (signalAddPoint !== prevSignalAddPoint.current) {
      prevSignalAddPoint.current = signalAddPoint;
      if (cursorPosition) {
        if (!activeStartPoint) {
          // First click: Set start point
          setActiveStartPoint(cursorPosition);
        } else {
          // Second click: Complete segment
          setSegments(prev => [...prev, { start: activeStartPoint, end: cursorPosition }]);
          setActiveStartPoint(null); // Reset for next measurement
        }
      }
    }

    // Handle Clear Signal
    if (signalClear !== prevSignalClear.current) {
      prevSignalClear.current = signalClear;
      setSegments([]);
      setActiveStartPoint(null);
    }

    // Handle Undo Signal
    if (signalUndo !== prevSignalUndo.current) {
      prevSignalUndo.current = signalUndo;
      if (activeStartPoint) {
        // If measuring, cancel current measurement
        setActiveStartPoint(null);
      } else {
        // If not measuring, remove last completed segment
        setSegments(prev => prev.slice(0, -1));
      }
    }
  }, [signalAddPoint, signalClear, signalUndo, cursorPosition, activeStartPoint]);

  const onCameraARHitTest = (results: any) => {
    if (results && results.hitTestResults && results.hitTestResults.length > 0) {
      const hit = results.hitTestResults[0];
      if (hit.transform && hit.transform.position) {
          setCursorPosition(hit.transform.position);
      } else if (hit.position) {
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

      {/* Render Completed Segments */}
      {segments.map((segment, index) => {
        const distance = calculateDistance(segment.start, segment.end);
        const midpoint = getMidpoint(segment.start, segment.end);
        
        return (
          <ViroNode key={`segment-${index}`}>
            {/* Start Point */}
            <ViroSphere
              height={0.02}
              length={0.02}
              width={0.02}
              position={segment.start as any}
              materials={["whiteSphere"]}
            />
            {/* End Point */}
            <ViroSphere
              height={0.02}
              length={0.02}
              width={0.02}
              position={segment.end as any}
              materials={["whiteSphere"]}
            />
            {/* Line */}
            <ViroPolyline
              position={[0,0,0]}
              points={[segment.start, segment.end] as any}
              thickness={0.005}
              materials={["lineStyle"]}
            />
            {/* Distance Label */}
            <ViroText
              text={formatDistance(distance)}
              position={midpoint as any}
              scale={[0.1, 0.1, 0.1]}
              style={styles.measurementText}
              transformBehaviors={["billboard"]}
            />
          </ViroNode>
        );
      })}

      {/* Render Active Dynamic Measurement */}
      {activeStartPoint && cursorPosition && (
        <ViroNode key="active-segment">
           {/* Start Point */}
           <ViroSphere
              height={0.02}
              length={0.02}
              width={0.02}
              position={activeStartPoint as any}
              materials={["whiteSphere"]}
            />
            {/* Dynamic Line */}
            <ViroPolyline
              position={[0,0,0]}
              points={[activeStartPoint, cursorPosition] as any}
              thickness={0.005}
              materials={["lineStyle"]}
            />
            {/* Dynamic Distance Label */}
            <ViroText
              text={formatDistance(calculateDistance(activeStartPoint, cursorPosition))}
              position={getMidpoint(activeStartPoint, cursorPosition) as any}
              scale={[0.1, 0.1, 0.1]}
              style={styles.measurementText}
              transformBehaviors={["billboard"]}
            />
        </ViroNode>
      )}
      
      {/* Cursor Marker */}
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