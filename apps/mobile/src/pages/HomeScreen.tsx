import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import AppHeader from "../components/AppHeader";
import QuickActionButton from "../components/QuickActionButton";
import FileCard from "../components/FileCard";
import { useDocuments } from "../lib/documents";
import { useUsage } from "../lib/usage";
import { createCheckoutSession } from "../lib/api";

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { documents } = useDocuments();
  const { usage } = useUsage();

  const handleCheckout = async () => {
    try {
      const url = await createCheckoutSession();
      if (url) {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const guardedNavigate = (route: string) => {
    if (usage?.isCapped) {
      Alert.alert("Limit reached", "You've used all free conversions. Go Pro to continue converting text.");
      return;
    }
    navigation.getParent()?.navigate(route);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <AppHeader title="Easy Read Toolbox" subtitle="Turn any document into accessible text" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickActionButton label="Scan Document" icon="camera" onPress={() => guardedNavigate("CameraCapture")} />
        <QuickActionButton label="Paste URL" icon="link" onPress={() => guardedNavigate("UrlImport")} />
        <QuickActionButton label="Upload PDF" icon="cloud-upload" onPress={() => guardedNavigate("PdfUpload")} />

        <View style={styles.usageCard}>
          <Text style={styles.usageTitle}>Monthly Usage</Text>
          <Text style={styles.usageSubtitle}>
            {usage
              ? `${usage.monthCount} / ${usage.limit} conversions`
              : "Loading usage..."}
          </Text>
          {usage?.isCapped ? (
            <TouchableOpacity style={styles.goProButton} onPress={handleCheckout}>
              <Text style={styles.goProText}>Go Pro</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Recent Conversions</Text>
        {documents.length === 0 ? (
          <Text style={styles.empty}>No conversions yet. Start with a quick action above.</Text>
        ) : (
          documents.slice(0, 5).map((doc) => (
            <FileCard
              key={doc.id}
              item={doc}
              onPress={() => navigation.getParent()?.navigate("ConversionPreview", { id: doc.id })}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6f8",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#3c1a35",
    marginBottom: 16,
  },
  usageCard: {
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f1bccb",
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4b1d3f",
  },
  usageSubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#5f4b57",
  },
  goProButton: {
    marginTop: 16,
    backgroundColor: "#4b1d3f",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  goProText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  empty: {
    color: "#6f5a67",
    fontSize: 16,
  },
});

export default HomeScreen;
