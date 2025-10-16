export type DocumentSource = "camera" | "url" | "pdf" | "image";

export interface Conversion {
  id: string;
  source: DocumentSource;
  originalText: string;
  easyReadText?: string;
  createdAt: string;
  title?: string;
}

export interface DocumentRecord extends Conversion {
  filename?: string;
  metadata?: Record<string, unknown>;
}

export interface UsageSummary {
  monthCount: number;
  limit: number;
  isCapped: boolean;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  preferences: {
    fontSize: number;
    lineHeight: number;
    darkMode: boolean;
    align: "left" | "center" | "justify";
  };
  subscription?: {
    active: boolean;
    renewsAt?: string;
  };
}
