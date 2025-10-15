import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from "react-native";

interface FloatingButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 32,
    right: 24,
    backgroundColor: "#d72638",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FloatingButton;
