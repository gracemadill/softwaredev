import React, { createContext, useContext, useMemo, useState } from "react";
import { DocumentRecord } from "@easy-read/shared";

interface DocumentContextValue {
  documents: DocumentRecord[];
  addDocument: (doc: DocumentRecord) => void;
  updateDocument: (id: string, update: Partial<DocumentRecord>) => void;
}

const DocumentContext = createContext<DocumentContextValue>({
  documents: [],
  addDocument: () => undefined,
  updateDocument: () => undefined,
});

export const DocumentsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  const value = useMemo(
    () => ({
      documents,
      addDocument: (doc: DocumentRecord) => setDocuments((prev) => [doc, ...prev]),
      updateDocument: (id: string, update: Partial<DocumentRecord>) =>
        setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...update } : doc))),
    }),
    [documents]
  );

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export function useDocuments() {
  return useContext(DocumentContext);
}
