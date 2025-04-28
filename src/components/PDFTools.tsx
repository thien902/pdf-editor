'use client';

import { useState } from 'react';
import { FaLock, FaUnlock, FaCut, FaCompress, FaExpand, FaFilePdf } from 'react-icons/fa';

const tools = [
  {
    id: 'convert',
    name: 'Convert to PDF',
    description: 'Convert various file types to PDF',
    icon: <FaFilePdf className="text-blue-500" />,
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract specific pages from your PDF',
    icon: <FaCut className="text-purple-500" />,
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: <FaCompress className="text-orange-500" />,
  },
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one',
    icon: <FaExpand className="text-red-500" />,
  },
];

export default function PDFTools() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pageNumbers, setPageNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setSelectedFiles([]);
    setPageNumbers('');
    setError(null);
  };

  const handleFileSelect = (files: File[]) => {
    if (selectedTool === 'merge') {
      setSelectedFiles(files.filter(file => file.type === 'application/pdf'));
    } else if (selectedTool === 'convert') {
      setSelectedFiles(files.filter(file => 
        file.type === 'application/pdf' ||
        file.type.startsWith('image/') ||
        file.type === 'text/plain' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ));
    } else {
      setSelectedFiles(files.filter(file => file.type === 'application/pdf').slice(0, 1));
    }
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files);
    } else {
      setError('Please upload files');
    }
  };

  const handleProcessComplete = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleProcess = async () => {
    if (selectedFiles.length < 1) {
      setError('Please select a file first');
      return;
    }

    if (selectedTool === 'split' && !pageNumbers.trim()) {
      setError('Please enter page numbers to extract');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (selectedTool === 'convert') {
        formData.append('file', selectedFiles[0]);
        const response = await fetch('/api/pdf/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to convert file');
        }

        const blob = await response.blob();
        handleProcessComplete(blob, 'converted.pdf');
      } else if (selectedTool === 'split') {
        formData.append('file', selectedFiles[0]);
        formData.append('pageNumbers', pageNumbers);
        const response = await fetch('/api/pdf/split', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to split PDF');
        }

        const blob = await response.blob();
        handleProcessComplete(blob, 'split-pages.pdf');
      } else if (selectedTool === 'merge') {
        if (selectedFiles.length < 2) {
          throw new Error('Please select at least 2 PDF files to merge');
        }
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
        const response = await fetch('/api/pdf/merge', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to merge PDFs');
        }

        const blob = await response.blob();
        handleProcessComplete(blob, 'merged.pdf');
      } else if (selectedTool === 'compress') {
        formData.append('file', selectedFiles[0]);
        const response = await fetch('/api/pdf/compress', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to compress PDF');
        }

        const blob = await response.blob();
        handleProcessComplete(blob, 'compressed.pdf');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  if (selectedTool) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {tools.find(tool => tool.id === selectedTool)?.name}
          </h2>
          <button
            onClick={() => setSelectedTool(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Tools
          </button>
        </div>

        <div className="space-y-2">
          <div 
            className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  {selectedTool === 'merge' 
                    ? 'Select multiple PDF files' 
                    : selectedTool === 'convert'
                    ? 'PDF, Images, Word, or Text files'
                    : 'PDF files only'}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept={
                  selectedTool === 'merge' 
                    ? '.pdf'
                    : selectedTool === 'convert'
                    ? '.pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx'
                    : '.pdf'
                }
                multiple={selectedTool === 'merge'}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    handleFileSelect(files);
                  }
                }}
              />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    onClick={() => {
                      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTool === 'split' && selectedFiles.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Numbers (e.g., 1-3,5,7-9)
            </label>
            <input
              type="text"
              value={pageNumbers}
              onChange={(e) => setPageNumbers(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
              placeholder="Enter page numbers to extract"
            />
          </div>
        )}

        {selectedFiles.length > 0 && (
          <button
            onClick={handleProcess}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Process'}
          </button>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolSelect(tool.id)}
            className="p-6 border rounded-lg cursor-pointer transition-all hover:shadow-lg border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{tool.icon}</span>
              <div>
                <h3 className="text-lg font-semibold">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 