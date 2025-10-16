import React from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/Navbar";
import { usePreferences } from "../lib/preferences";

const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences } = usePreferences();

  return (
    <ScrollView style={styles.container}>
      <Navbar title="Settings" />
      <View style={styles.content}>
        <View style={styles.settingRow}>
          <Text style={styles.label}>Font Size</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updatePreferences({ fontSize: Math.max(14, preferences.fontSize - 2) })}
            >
              <Text style={styles.adjustText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{preferences.fontSize}</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updatePreferences({ fontSize: Math.min(28, preferences.fontSize + 2) })}
            >
              <Text style={styles.adjustText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Line Height</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updatePreferences({ lineHeight: Math.max(1.2, Number((preferences.lineHeight - 0.1).toFixed(1))) })}
            >
              <Text style={styles.adjustText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.value}>{preferences.lineHeight.toFixed(1)}</Text>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => updatePreferences({ lineHeight: Math.min(2.0, Number((preferences.lineHeight + 0.1).toFixed(1))) })}
            >
              <Text style={styles.adjustText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch
            value={preferences.darkMode}
            onValueChange={(value) => updatePreferences({ darkMode: value })}
            trackColor={{ true: "#d72638", false: "#d2c0c8" }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.label}>Alignment</Text>
          <View style={styles.alignGroup}>
            {(["left", "center", "justify"] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.alignButton, preferences.align === opt && styles.alignButtonActive]}
                onPress={() => updatePreferences({ align: opt })}
              >
                <Text style={[styles.alignText, preferences.align === opt && styles.alignTextActive]}>{
                  opt.charAt(0).toUpperCase() + opt.slice(1)
                }</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  settingRow: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a35",
    marginBottom: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  adjustButton: {
    backgroundColor: "#d72638",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  adjustText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  value: {
    width: 50,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#4b1d3f",
  },
  alignGroup: {
    flexDirection: "row",
    gap: 12,
  },
  alignButton: {
    borderWidth: 1,
    borderColor: "#f1bccb",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  alignButtonActive: {
    backgroundColor: "#d72638",
    borderColor: "#d72638",
  },
  alignText: {
    color: "#4b1d3f",
    fontWeight: "600",
  },
  alignTextActive: {
    color: "#fff",
  },
});

export default SettingsScreen;
