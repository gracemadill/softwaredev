import React from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: (event: GestureResponderEvent) => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={28} color="#fff" />
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d72638",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  label: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});

export default QuickActionButton;
