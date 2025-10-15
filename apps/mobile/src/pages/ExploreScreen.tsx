import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Navbar from "../components/Navbar";

const ExploreScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Navbar title="Explore" />
      <View style={styles.content}>
        <Text style={styles.heading}>Discover Accessible Reading Tips</Text>
        <Text style={styles.paragraph}>
          Learn how to create documents that are easier to read and understand. Explore guides, checklists, and
          resources curated for accessibility champions.
        </Text>
        <Text style={styles.subheading}>Featured Guides</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Writing in Easy Read Style</Text>
          <Text style={styles.cardCopy}>Break complex information into short sentences and explain new words.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accessible PDFs Checklist</Text>
          <Text style={styles.cardCopy}>Structure your documents so screen readers can follow along.</Text>
        </View>
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
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3c1a35",
    marginBottom: 12,
  },
  paragraph: {
    color: "#6f5a67",
    fontSize: 16,
    lineHeight: 24,
  },
  subheading: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "700",
    color: "#4b1d3f",
  },
  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1bccb",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#3c1a35",
  },
  cardCopy: {
    marginTop: 8,
    color: "#6f5a67",
  },
});

export default ExploreScreen;
