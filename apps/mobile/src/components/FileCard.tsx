import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DocumentRecord } from "@easy-read/shared";

interface FileCardProps {
  item: DocumentRecord;
  onPress?: (item: DocumentRecord) => void;
}

const FileCard: React.FC<FileCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.85}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.source.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>{item.title || "Untitled Conversion"}</Text>
      <Text numberOfLines={2} style={styles.preview}>
        {item.easyReadText || item.originalText.slice(0, 120)}
      </Text>
      <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1bccb",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#f6d7df",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    color: "#b01d34",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3c1a35",
  },
  preview: {
    marginTop: 8,
    color: "#5f4b57",
    fontSize: 14,
  },
  timestamp: {
    marginTop: 12,
    fontSize: 12,
    color: "#8a6b78",
  },
});

export default FileCard;
