'use client';

import { useState, useCallback, useRef } from 'react';

type ConversionDirection = 'ts-to-excel' | 'excel-to-ts';

export default function Home() {
  const [direction, setDirection] = useState<ConversionDirection>('ts-to-excel');
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileType = direction === 'ts-to-excel' ? '.ts' : '.xlsx,.xls';
  const acceptedFileName = direction === 'ts-to-excel' ? 'TypeScript (.ts)' : 'Excel (.xlsx)';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setIsConverting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('direction', direction);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      
      if (direction === 'ts-to-excel') {
        a.download = file.name.replace('.ts', '') + '-translations.xlsx';
      } else {
        a.download = file.name.replace(/\.(xlsx|xls)/, '') + '-translations.ts';
      }
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '✨ Conversion successful! File downloaded.' });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Conversion failed' });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16 animate-fadeInUp">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-coral to-coral-dark flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl mb-4 text-navy">
            Translation Converter
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Seamlessly convert between TypeScript translation files and Excel spreadsheets. 
            Perfect for collaborating with translators.
          </p>
        </header>

        {/* Main Card */}
        <div 
          className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}
        >
          {/* Direction Switcher */}
          <div className="bg-gradient-to-r from-navy to-navy-light p-8">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setDirection('ts-to-excel');
                  setFile(null);
                  setMessage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`
                  flex-1 max-w-xs py-4 px-6 rounded-2xl font-medium text-lg text-black
                  transition-all duration-300 transform hover:scale-105
                  ${direction === 'ts-to-excel'
                    ? 'bg-coral shadow-xl'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="text-left">
                    <div className="font-semibold">TypeScript</div>
                    <div className="text-xs opacity-80">to Excel</div>
                  </div>
                </div>
              </button>
              
              <div className="text-3xl text-white/40">→</div>
              
              <button
                onClick={() => {
                  setDirection('excel-to-ts');
                  setFile(null);
                  setMessage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`
                  flex-1 max-w-xs py-4 px-6 rounded-2xl font-medium text-lg text-black
                  transition-all duration-300 transform hover:scale-105
                  ${direction === 'excel-to-ts'
                    ? 'bg-sage shadow-xl'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div className="text-left">
                    <div className="font-semibold">Excel</div>
                    <div className="text-xs opacity-80">to TypeScript</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300 hover:border-coral hover:bg-cream-dark
                ${isDragging 
                  ? 'border-coral bg-coral/5 scale-105' 
                  : file 
                    ? 'border-sage bg-sage/5' 
                    : 'border-gray-300'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileType}
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="space-y-3">
                  <div className="text-5xl mb-4">✓</div>
                  <div className="text-xl font-medium text-navy">{file.name}</div>
                  <div className="text-sm text-text-muted">
                    {(file.size / 1024).toFixed(2)} KB
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-coral hover:text-coral-dark text-sm font-medium mt-2"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-6xl mb-4">
                    {direction === 'ts-to-excel' ? '📄' : '📊'}
                  </div>
                  <div className="text-xl font-medium text-navy">
                    Drop your {acceptedFileName} file here
                  </div>
                  <div className="text-sm text-text-muted">
                    or click to browse
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`
                  mt-6 p-4 rounded-xl animate-fadeInUp
                  ${message.type === 'success' 
                    ? 'bg-sage/10 text-sage border border-sage/30' 
                    : 'bg-coral/10 text-coral-dark border border-coral/30'
                  }
                `}
              >
                {message.text}
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className={`
                w-full mt-8 py-5 px-8 rounded-2xl font-semibold text-lg
                transition-all duration-300 transform hover:scale-105
                ${file && !isConverting
                  ? 'bg-gradient-to-r from-coral to-coral-light text-black shadow-xl hover:shadow-2xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isConverting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Converting...
                </span>
              ) : (
                `Convert ${direction === 'ts-to-excel' ? 'to Excel' : 'to TypeScript'}`
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div 
          className="grid md:grid-cols-3 gap-6 mt-12 animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { icon: '🎯', title: 'Preserves Structure', desc: 'Maintains nested keys using dot notation' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Convert thousands of entries in seconds' },
            { icon: '🔄', title: 'Bidirectional', desc: 'Convert back and forth seamlessly' }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </main>
  );
}
