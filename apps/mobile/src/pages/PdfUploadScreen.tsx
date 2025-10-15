import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Navbar from "../components/Navbar";
import { uploadPdf } from "../lib/api";
import { useDocuments } from "../lib/documents";
import { DocumentRecord } from "@easy-read/shared";

const PdfUploadScreen: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { addDocument } = useDocuments();

  const handlePick = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (result.type === "cancel") {
        setLoading(false);
        return;
      }

      const text = await uploadPdf(result.assets?.[0]?.uri || result.uri, result.name || "upload.pdf");
      const doc: DocumentRecord = {
        id: `doc-${Date.now()}`,
        source: "pdf",
        originalText: text,
        createdAt: new Date().toISOString(),
        title: result.name || "Uploaded PDF",
      };
      addDocument(doc);
      navigation.navigate("ConversionPreview", { id: doc.id });
    } catch (err) {
      console.error(err);
      Alert.alert("Upload failed", "We couldn't read that PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Upload PDF" />
      <View style={styles.content}>
        <Text style={styles.description}>Select a PDF document to extract text from.</Text>
        <TouchableOpacity style={styles.button} onPress={handlePick} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Choose File</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6f8",
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: "#4b1d3f",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#d72638",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PdfUploadScreen;
