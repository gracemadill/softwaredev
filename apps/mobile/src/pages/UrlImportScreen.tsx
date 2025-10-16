import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Navbar from "../components/Navbar";
import { extractFromUrl } from "../lib/api";
import { useDocuments } from "../lib/documents";
import { DocumentRecord } from "@easy-read/shared";

const UrlImportScreen: React.FC<any> = ({ navigation }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { addDocument } = useDocuments();

  const handleImport = async () => {
    if (!url) return;
    try {
      setLoading(true);
      const text = await extractFromUrl(url);
      const doc: DocumentRecord = {
        id: `doc-${Date.now()}`,
        source: "url",
        originalText: text,
        createdAt: new Date().toISOString(),
        title: url,
      };
      addDocument(doc);
      navigation.navigate("ConversionPreview", { id: doc.id });
    } catch (err) {
      console.error(err);
      Alert.alert("Import failed", "We couldn't fetch that URL. Please check the link and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar title="Import from URL" />
      <View style={styles.content}>
        <Text style={styles.label}>Paste a link to convert into Easy Read text.</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com/article"
          autoCapitalize="none"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleImport} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Extract Text</Text>}
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
  label: {
    fontSize: 16,
    color: "#4b1d3f",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#f1bccb",
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

export default UrlImportScreen;
