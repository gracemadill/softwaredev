import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { uploadImage } from "../lib/api";
import { useDocuments } from "../lib/documents";
import { DocumentRecord } from "@easy-read/shared";

const CameraCaptureScreen: React.FC<any> = ({ navigation }) => {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addDocument } = useDocuments();

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => setHasPermission(status === "granted"));
  }, []);

  const handleCapture = async () => {
    if (isProcessing || !cameraRef.current) return;
    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync();
      const text = await uploadImage(photo.uri, `scan-${Date.now()}.jpg`);
      const doc: DocumentRecord = {
        id: `doc-${Date.now()}`,
        source: "camera",
        originalText: text,
        createdAt: new Date().toISOString(),
        title: "Camera Scan",
      };
      addDocument(doc);
      navigation.navigate("ConversionPreview", { id: doc.id });
    } catch (err) {
      console.error(err);
      Alert.alert("Capture failed", "We couldn't process that photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera access is required to scan documents.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={CameraType.back} ratio="16:9" />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture} disabled={isProcessing}>
          {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={styles.captureText}>Extract Text</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  captureButton: {
    backgroundColor: "#d72638",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  captureText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fef6f8",
  },
  permissionText: {
    textAlign: "center",
    color: "#4b1d3f",
    fontSize: 16,
  },
});

export default CameraCaptureScreen;
