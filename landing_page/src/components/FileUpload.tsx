import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (data: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        onFileUpload(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-gray-600 hover:border-purple-500 hover:bg-gray-700/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-purple-500" />
      {isDragActive ? (
        <p className="text-purple-400">Drop the JSON file here...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-300">
            Drag & drop your raw.json or doc1.json file here
          </p>
          <p className="text-sm text-gray-500">
            Supports Slack messages, Google Docs content, and meeting notes
          </p>
        </div>
      )}
    </motion.div>
  );
};