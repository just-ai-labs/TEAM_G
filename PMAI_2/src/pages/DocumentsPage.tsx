import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import useDrivePicker from 'react-google-drive-picker';
import { useDropzone } from 'react-dropzone';
import { FileText, Download, Trash2, Eye, Upload, Filter, File as FileIcon, FileImage, FileVideo, FileAudio, File as FilePdf, FileArchive, FileSpreadsheet, Presentation as FilePresentation, Search } from 'lucide-react';
import { format } from 'date-fns';
import bytes from 'bytes';

interface Document {
  id: string;
  name: string;
  mimeType: string;
  size: string | number;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  iconLink: string;
}

const DocumentsPage = () => {
  const [openPicker, authResponse] = useDrivePicker();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewType, setViewType] = useState<'recent' | 'all'>('recent');
  const [fileType, setFileType] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileTypes = [
    { value: 'all', label: 'All Files' },
    { value: 'document', label: 'Documents' },
    { value: 'spreadsheet', label: 'Spreadsheets' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' }
  ];

  const handleOpenPicker = () => {
    openPicker({
      clientId: "25000618525-vi62gdlphpare0a6d7c967k6p9ppok4a.apps.googleusercontent.com",
      developerKey: "AIzaSyC8EF8EF61hhzvd997hJhoZ43mhpo_FmUo",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data: any) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
          return;
        }
        if (data.action === 'picked') {
          setIsConnected(true);
          const docs = data.docs.map((doc: any) => ({
            id: doc.id,
            name: doc.name,
            mimeType: doc.mimeType || 'application/octet-stream',
            size: doc.sizeBytes || '0',
            createdTime: doc.createdTime || new Date().toISOString(),
            modifiedTime: doc.lastModifiedTime || new Date().toISOString(),
            webViewLink: doc.embedUrl || doc.url,
            iconLink: doc.iconUrl || ''
          }));
          setDocuments(docs);
          console.log('Picked documents:', docs);
        }
      },
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload to Google Drive
    const newDocs = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      webViewLink: URL.createObjectURL(file),
      iconLink: ''
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: !isConnected
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FilePdf className="w-6 h-6 text-red-400" />;
    if (mimeType.includes('spreadsheet')) return <FileSpreadsheet className="w-6 h-6 text-green-400" />;
    if (mimeType.includes('presentation')) return <FilePresentation className="w-6 h-6 text-yellow-400" />;
    if (mimeType.includes('image')) return <FileImage className="w-6 h-6 text-purple-400" />;
    if (mimeType.includes('video')) return <FileVideo className="w-6 h-6 text-blue-400" />;
    if (mimeType.includes('audio')) return <FileAudio className="w-6 h-6 text-pink-400" />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <FileArchive className="w-6 h-6 text-orange-400" />;
    return <FileText className="w-6 h-6 text-gray-400" />;
  };

  const handleDelete = async (docId: string) => {
    try {
      setDocuments(docs => docs.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = fileType === 'all' || doc.mimeType.includes(fileType);
      return matchesSearch && matchesType;
    })
    .slice(0, viewType === 'recent' ? 10 : undefined);

  return (
    <div className="min-h-screen bg-[#1a1b2e] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {!isConnected ? (
          <div className="text-center py-20">
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleOpenPicker}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Connect with Drive
            </motion.button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 bg-[#2d1b4e] border border-[#4c3b6e] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value as 'recent' | 'all')}
                  className="bg-[#2d1b4e] border border-[#4c3b6e] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="recent">Recent Documents</option>
                  <option value="all">All Documents</option>
                </select>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="bg-[#2d1b4e] border border-[#4c3b6e] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fileTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <p className="text-gray-300">
                Drag & drop files here or click to upload
              </p>
            </div>

            {/* Documents List */}
            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No documents found
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#2d1b4e] p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.mimeType)}
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-400">
                          {bytes(Number(doc.size))} • Modified {format(new Date(doc.modifiedTime), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-2 hover:bg-[#1a1b2e] rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-blue-400" />
                      </button>
                      <a
                        href={doc.webViewLink}
                        download
                        className="p-2 hover:bg-[#1a1b2e] rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5 text-green-400" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 hover:bg-[#1a1b2e] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Document Preview Modal */}
            {selectedDoc && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#2d1b4e] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold">{selectedDoc.name}</h2>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <div className="aspect-video mb-4">
                    <iframe
                      src={`${selectedDoc.webViewLink}?embedded=true`}
                      className="w-full h-full rounded-lg"
                      title={selectedDoc.name}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Size</p>
                      <p>{bytes(Number(selectedDoc.size))}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Created</p>
                      <p>{format(new Date(selectedDoc.createdTime), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Modified</p>
                      <p>{format(new Date(selectedDoc.modifiedTime), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Type</p>
                      <p>{selectedDoc.mimeType.split('/').pop()}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;