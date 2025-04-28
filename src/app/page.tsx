'use client';

import PDFTools from '@/components/PDFTools';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Tools
          </h1>
          <p className="text-xl text-gray-600">
            Choose a tool to get started
          </p>
        </div>
        
        <PDFTools />
      </div>
    </div>
  );
} 