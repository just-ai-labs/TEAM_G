import React, { createContext, useContext, useState } from 'react';

export interface Document {
  id: string;
  name: string;
  mimeType: string;
  size: string | number;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  iconLink: string;
}

interface DocumentContextType {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  return (
    <DocumentContext.Provider value={{ documents, setDocuments }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};