'use client';

import React, { useRef, useState, useCallback } from 'react';
import { DocumentType } from '@/types';
import { validateFile, DOCUMENT_TYPE_LABELS } from '@/lib/document-utils';

interface DocumentUploaderProps {
  entityId: string;
  propertyId?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (document: any) => void;
  onUploadError?: (error: string) => void;
}

export default function DocumentUploader({
  entityId,
  propertyId,
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentType, setDocumentType] = useState<DocumentType>('other');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [tags, setTags] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file
      const validation = validateFile(file, {
        maxSizeBytes: 10 * 1024 * 1024,
      });

      if (!validation.valid) {
        onUploadError?.(validation.error || 'File validation failed');
        return;
      }

      setIsUploading(true);
      onUploadStart?.();

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entity_id', entityId);
        formData.append('document_type', documentType);

        if (propertyId) {
          formData.append('property_id', propertyId);
        }

        if (year) {
          formData.append('year', year);
        }

        // Add tags
        tags.split(',').forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed) {
            formData.append('tags', trimmed);
          }
        });

        const response = await fetch('/api/upload/document', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        onUploadComplete?.(result.document);

        // Reset form
        setDocumentType('other');
        setYear(new Date().getFullYear().toString());
        setTags('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        onUploadError?.(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [entityId, propertyId, documentType, year, tags, onUploadStart, onUploadComplete, onUploadError]
  );

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-blue-300 hover:border-blue-500'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />

          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Drop your document here or click to browse
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Supported formats: PDF, Word, Excel, Images (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document metadata form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            disabled={isUploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Year (optional)
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={isUploading}
            min={1990}
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Tags (comma-separated, optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isUploading}
            placeholder="e.g., quarterly, important, followup"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
