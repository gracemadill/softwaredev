import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { UsageSummary } from "@easy-read/shared";

const API_BASE =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUsage(): Promise<UsageSummary> {
  const { data } = await client.get<UsageSummary>("/usage/me");
  return data;
}

export async function incrementUsage(): Promise<UsageSummary> {
  const { data } = await client.post<UsageSummary>("/usage/increment", {});
  return data;
}

export async function rewriteText(text: string, keepTerms: string[] = []) {
  const { data } = await client.post<{ easyReadText: string }>("/ai/rewrite", {
    text,
    rules: { keepTerms },
  });
  return data.easyReadText;
}

export async function uploadPdf(uri: string, filename = "document.pdf") {
  const formData = new FormData();
  const filePart =
    Platform.OS === "web"
      ? ((uri as unknown) as Blob)
      : ({ uri, name: filename, type: "application/pdf" } as any);
  formData.append("file", filePart as any);
  const { data } = await client.post<{ text: string }>("/upload/pdf", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.text;
}

export async function uploadImage(uri: string, filename = "image.jpg") {
  const formData = new FormData();
  const imagePart =
    Platform.OS === "web"
      ? ((uri as unknown) as Blob)
      : ({ uri, name: filename, type: "image/jpeg" } as any);
  formData.append("file", imagePart as any);
  const { data } = await client.post<{ text: string }>("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.text;
}

export async function extractFromUrl(url: string) {
  const { data } = await client.post<{ text: string }>("/upload/url", { url });
  return data.text;
}

export async function createCheckoutSession() {
  const { data } = await client.post<{ url: string }>("/billing/checkout", {});
  return data.url;
}
