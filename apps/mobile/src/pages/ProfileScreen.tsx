import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Navbar from "../components/Navbar";
import { useUsage } from "../lib/usage";

const ProfileScreen: React.FC = () => {
  const { usage } = useUsage();

  return (
    <ScrollView style={styles.container}>
      <Navbar title="Profile" />
      <View style={styles.content}>
        <Text style={styles.name}>Demo User</Text>
        <Text style={styles.email}>demo@easyread.app</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription</Text>
          <Text style={styles.cardCopy}>{usage?.isCapped ? "Free Plan" : "Pro (mock)"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Usage this month</Text>
          <Text style={styles.cardCopy}>
            {usage ? `${usage.monthCount} of ${usage.limit} conversions` : "Loading..."}
          </Text>
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
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3c1a35",
  },
  email: {
    marginTop: 4,
    fontSize: 16,
    color: "#6f5a67",
  },
  card: {
    marginTop: 24,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1bccb",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4b1d3f",
  },
  cardCopy: {
    marginTop: 8,
    fontSize: 16,
    color: "#6f5a67",
  },
});

export default ProfileScreen;
