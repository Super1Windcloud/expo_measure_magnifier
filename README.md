# Measure Magnifier

An iOS-like utility application built with **Expo** and **ViroReact**, featuring an AR tape measure and a high-fidelity camera magnifier.

## Overview

Measure Magnifier combines two essential utility tools into a single app:

1.  **Measure (AR)**: A precise Augmented Reality measurement tool that mimics the functionality of the native iOS Measure app. It allows users to measure distances in the real world by placing points on surfaces.
2.  **Magnifier**: A camera-based magnifier with up to 5x zoom, providing a clear view of small text or objects.

## Features

### 📏 AR Measure
-   **Point-to-Point Measurement**: Click to drop a start point, move to an end point, and click again to measure the distance.
-   **Dynamic Preview**: See a real-time line and distance label connecting your last point to the current cursor position.
-   **Multiple Segments**: Measure multiple independent segments in the same session.
-   **Surface Detection**: Automatically detects planes (floors, tables) to anchor measurements securely.
-   **Undo/Clear Support**: Easily undo the last action or clear all measurements to start fresh.
-   **Visual Feedback**: Includes a center reticle for aiming and clear distance labels.

### 🔍 Magnifier
-   **Zoom Control**: Smooth zoom up to 5x using a slider or pinch gestures.
-   **Live Preview**: High-quality camera feed.
-   **Simple Interface**: Clean, distraction-free UI focused on visibility.

## Tech Stack

-   **Framework**: [Expo](https://expo.dev/) (Managed workflow with Prebuild)
-   **AR Engine**: [@reactvision/react-viro](https://www.npmjs.com/package/@reactvision/react-viro)
-   **Camera**: [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
-   **Animations**: [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)
-   **Navigation**: [expo-router](https://docs.expo.dev/router/introduction/)

## Prerequisites

-   **Physical Device**: AR and Camera features require a physical iOS or Android device. **This app will not work in a simulator/emulator.**
-   **Development Build**: ViroReact requires native code, so you cannot use the standard "Expo Go" app. You must build a custom development client.

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd expo_measure_magnifier
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Generate Native Code (Prebuild)**:
    This step creates the `android` and `ios` directories required for ViroReact.
    ```bash
    npx expo prebuild --clean
    ```

## Running the App

### iOS
1.  **Build and Run**:
    ```bash
    npx expo run:ios --device
    ```
    *Note: You must have a physical iOS device connected to your Mac via USB.*

2.  **Troubleshooting**:
    If you encounter "no such module 'ExpoModulesCore'", open the workspace in Xcode and run from there:
    ```bash
    open ios/MeasureMagnifier.xcworkspace
    ```

### Android
1.  **Build and Run**:
    ```bash
    npx expo run:android --device
    ```
    *Note: Ensure USB Debugging is enabled on your Android device.*

## Usage

### Using the Measure Tool
1.  Open the **Measure** tab.
2.  Move your phone slowly to allow the camera to detect surfaces.
3.  Align the center reticle (+) with the starting point of your object.
4.  Tap the **+** button at the bottom to start a measurement.
5.  Move your phone to the end point. You will see a line and distance label following your movement.
6.  Tap the **+** button again to place the end point and fix the measurement.
7.  Repeat to measure other objects.
8.  Use the **Arrow** icon (top left) to Undo, or **Clear** (top right) to remove all measurements.

### Using the Magnifier
1.  Open the **Magnifier** tab.
2.  Point your camera at the object or text you want to magnify.
3.  Use the **Slider** or **Pinch** the screen to zoom in/out.

## Permissions

The app will request the following permissions on first launch:
-   **Camera**: Required for AR and Magnifier functionality.
-   **Microphone**: Required by ViroReact (even if not explicitly used for audio recording).
-   **Photo Library**: (Optional) For saving snapshots if implemented.

## Credits

Built using the [ViroReact Starter Kit](https://github.com/ViroCommunity/starter-kit) as a base.