import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FileCard from "../components/FileCard";
import FloatingButton from "../components/FloatingButton";
import Navbar from "../components/Navbar";
import { useDocuments } from "../lib/documents";

const DocumentsScreen: React.FC<any> = ({ navigation }) => {
  const { documents } = useDocuments();

  return (
    <View style={styles.container}>
      <Navbar title="Documents" />
      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No documents yet. Start a conversion from Home.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FileCard
              item={item}
              onPress={() => navigation.getParent()?.navigate("ConversionPreview", { id: item.id })}
            />
          )}
        />
      )}
      <FloatingButton label="New Conversion" onPress={() => navigation.navigate("Home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fef6f8",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: "center",
    color: "#6f5a67",
    fontSize: 16,
  },
});

export default DocumentsScreen;
