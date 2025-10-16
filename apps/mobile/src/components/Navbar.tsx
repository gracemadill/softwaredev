import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0d7df",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b1d3f",
  },
});

export default Navbar;
