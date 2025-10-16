import "react-native-gesture-handler";
import React from "react";
import { DefaultTheme, DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./pages/HomeScreen";
import DocumentsScreen from "./pages/DocumentsScreen";
import ExploreScreen from "./pages/ExploreScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import CameraCaptureScreen from "./pages/CameraCaptureScreen";
import UrlImportScreen from "./pages/UrlImportScreen";
import PdfUploadScreen from "./pages/PdfUploadScreen";
import ConversionPreviewScreen from "./pages/ConversionPreviewScreen";
import { PreferencesProvider, usePreferences } from "./lib/preferences";
import { DocumentsProvider } from "./lib/documents";
import { UsageProvider } from "./lib/usage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Documents: "document-text",
  Explore: "compass",
  Profile: "person",
  Settings: "settings",
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#d72638",
        tabBarInactiveTintColor: "#9b7c88",
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIcon[route.name] || "ellipse";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator: React.FC = () => {
  const { preferences } = usePreferences();
  const theme = preferences.darkMode
    ? {
        ...DarkTheme,
        colors: { ...DarkTheme.colors, primary: "#d72638", background: "#1a1118", card: "#2b1f28" },
      }
    : {
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, primary: "#d72638", background: "#fef6f8", card: "#fff" },
      };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
        <Stack.Screen name="UrlImport" component={UrlImportScreen} />
        <Stack.Screen name="PdfUpload" component={PdfUploadScreen} />
        <Stack.Screen name="ConversionPreview" component={ConversionPreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <UsageProvider>
        <DocumentsProvider>
          <AppNavigator />
        </DocumentsProvider>
      </UsageProvider>
    </PreferencesProvider>
  );
};

export default App;
