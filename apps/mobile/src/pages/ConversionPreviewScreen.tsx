import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/Navbar";
import { useDocuments } from "../lib/documents";
import { usePreferences } from "../lib/preferences";
import { useUsage } from "../lib/usage";
import { rewriteText } from "../lib/api";

const ConversionPreviewScreen: React.FC<any> = ({ route }) => {
  const { id } = route.params as { id: string };
  const { documents, updateDocument } = useDocuments();
  const doc = useMemo(() => documents.find((item) => item.id === id), [documents, id]);
  const { preferences } = usePreferences();
  const { usage, increment } = useUsage();
  const [loading, setLoading] = useState(false);

  if (!doc) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Document not found.</Text>
      </View>
    );
  }

  const handleConvert = async () => {
    if (usage && usage.isCapped) {
      Alert.alert("Limit reached", "You've used all free conversions. Go Pro from the Home screen to continue.");
      return;
    }
    try {
      setLoading(true);
      const easyRead = await rewriteText(doc.originalText);
      updateDocument(doc.id, { easyReadText: easyRead });
      await increment();
    } catch (err) {
      console.error(err);
      Alert.alert("Conversion failed", "We couldn't rewrite that text. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!doc.easyReadText) {
      Alert.alert("No easy-read text", "Convert the text before sharing.");
      return;
    }
    await Share.share({
      title: doc.title || "Easy Read Conversion",
      message: doc.easyReadText,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Navbar title="Conversion" />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Original Text</Text>
        <Text style={styles.block}>{doc.originalText}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Easy Read Text</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleConvert} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Convert to Easy Read</Text>}
          </TouchableOpacity>
        </View>
        {doc.easyReadText ? (
          <Text
            style={[
              styles.block,
              {
                fontSize: preferences.fontSize,
                lineHeight: preferences.fontSize * preferences.lineHeight,
                textAlign: preferences.align,
                backgroundColor: preferences.darkMode ? "#2b1f28" : "#fff",
                color: preferences.darkMode ? "#f6d7df" : "#4b1d3f",
              },
            ]}
          >
            {doc.easyReadText}
          </Text>
        ) : (
          <Text style={styles.placeholder}>Run the conversion to see the Easy Read version.</Text>
        )}

        <TouchableOpacity style={[styles.secondaryButton, !doc.easyReadText && styles.secondaryButtonDisabled]} onPress={handleShare}>
          <Text style={styles.secondaryText}>Share Easy Read Text</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6f8",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3c1a35",
    marginBottom: 12,
  },
  block: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1bccb",
    color: "#4b1d3f",
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    color: "#6f5a67",
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "column",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#d72638",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: "#4b1d3f",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryText: {
    color: "#fff",
    fontWeight: "700",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#4b1d3f",
    fontSize: 16,
  },
});

export default ConversionPreviewScreen;
