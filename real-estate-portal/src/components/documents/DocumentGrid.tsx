'use client';

import React, { useState } from 'react';
import { Document } from '@/types';
import {
  formatFileSize,
  formatDate,
  getFileIcon,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_COLORS,
} from '@/lib/document-utils';

interface DocumentGridProps {
  documents: Document[];
  view?: 'grid' | 'list';
  onDownload?: (documentId: string) => void;
  onDelete?: (documentId: string) => void;
  onSelect?: (documentId: string) => void;
  selectedIds?: Set<string>;
}

export default function DocumentGrid({
  documents,
  view = 'grid',
  onDownload,
  onDelete,
  onSelect,
  selectedIds,
}: DocumentGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500">No documents found</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
            onMouseEnter={() => setHoveredId(doc.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-center flex-1">
              {onSelect && (
                <input
                  type="checkbox"
                  checked={selectedIds?.has(doc.id) || false}
                  onChange={() => onSelect(doc.id)}
                  className="mr-4 w-5 h-5 rounded border-gray-300"
                />
              )}

              <div className="text-2xl mr-4">{getFileIcon(doc.file_type)}</div>

              <div className="flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {doc.file_name}
                </p>
                <div className="flex gap-3 mt-1 text-sm text-gray-500">
                  <span>{formatFileSize(doc.file_size)}</span>
                  <span>{formatDate(doc.document_date)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${DOCUMENT_TYPE_COLORS[doc.document_type as any]}`}>
                    {DOCUMENT_TYPE_LABELS[doc.document_type as any]}
                  </span>
                </div>
                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              {hoveredId === doc.id && (
                <>
                  {onDownload && (
                    <button
                      onClick={() => onDownload(doc.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      ⬇️
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this document?')) {
                          onDelete(doc.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          onMouseEnter={() => setHoveredId(doc.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="space-y-4">
            <div className="text-5xl">{getFileIcon(doc.file_type)}</div>

            <div>
              <p className="font-semibold text-gray-900 truncate mb-1">
                {doc.file_name}
              </p>
              <p className="text-sm text-gray-500">{formatFileSize(doc.file_size)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DOCUMENT_TYPE_COLORS[doc.document_type as any]}`}>
                {DOCUMENT_TYPE_LABELS[doc.document_type as any]}
              </span>
            </div>

            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {doc.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {doc.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{doc.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
              {formatDate(doc.document_date)}
            </div>

            {hoveredId === doc.id && (
              <div className="flex gap-2 pt-2">
                {onDownload && (
                  <button
                    onClick={() => onDownload(doc.id)}
                    className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this document?')) {
                        onDelete(doc.id);
                      }
                    }}
                    className="py-2 px-3 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
