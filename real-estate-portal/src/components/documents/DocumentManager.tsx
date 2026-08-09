'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Document, DocumentType } from '@/types';
import DocumentUploader from './DocumentUploader';
import DocumentGrid from './DocumentGrid';
import DocumentSearch from './DocumentSearch';
import DocumentStats from './DocumentStats';
import { filterDocuments, sortDocuments } from '@/lib/document-utils';

type ViewType = 'grid' | 'list';
type TabType = 'documents' | 'upload' | 'stats';

interface DocumentManagerProps {
  entityId: string;
  entitySlug?: string;
  propertyId?: string;
  title?: string;
}

export default function DocumentManager({
  entityId,
  entitySlug,
  propertyId,
  title = 'Document Management',
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'type'>('date');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({ entity_id: entityId });
      if (propertyId) {
        params.append('property_id', propertyId);
      }

      const response = await fetch(`/api/documents/search?${params}`);
      if (!response.ok) throw new Error('Failed to fetch documents');

      const data = await response.json();
      setDocuments(data.data || []);
      setFilteredDocuments(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching documents';
      setError(errorMessage);
      console.error('Document fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, propertyId]);

  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle search
  const handleSearch = useCallback(
    (filters: {
      query?: string;
      types?: DocumentType[];
      tags?: string[];
      year?: string;
    }) => {
      let filtered = documents;

      // Apply type filter
      if (filters.types && filters.types.length > 0) {
        filtered = filtered.filter((doc) =>
          filters.types!.includes(doc.document_type as DocumentType)
        );
      }

      // Apply search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(
          (doc) =>
            doc.file_name.toLowerCase().includes(query) ||
            doc.description?.toLowerCase().includes(query)
        );
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter((doc) => {
          if (!doc.tags || doc.tags.length === 0) return false;
          const docTags = doc.tags.map((t) => t.toLowerCase());
          return filters.tags!.some((tag) =>
            docTags.includes(tag.toLowerCase())
          );
        });
      }

      // Apply year filter
      if (filters.year) {
        filtered = filtered.filter((doc) => {
          if (!doc.document_date) return false;
          const year = new Date(doc.document_date).getFullYear().toString();
          return year === filters.year;
        });
      }

      // Apply sorting
      filtered = sortDocuments(filtered, sortBy, false);
      setFilteredDocuments(filtered);
    },
    [documents, sortBy]
  );

  // Handle download
  const handleDownload = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(
        `/api/documents/signed-url?document_id=${documentId}`
      );
      if (!response.ok) throw new Error('Failed to get download URL');

      const data = await response.json();
      const link = document.createElement('a');
      link.href = data.signed_url;
      link.download = data.file_name;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download document');
    }
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (documentId: string) => {
    try {
      const response = await fetch('/api/documents/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_id: documentId }),
      });

      if (!response.ok) throw new Error('Failed to delete document');

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
      setFilteredDocuments((prev) =>
        prev.filter((doc) => doc.id !== documentId)
      );
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete document');
    }
  }, []);

  // Handle upload complete
  const handleUploadComplete = useCallback((document: Document) => {
    setDocuments((prev) => [document, ...prev]);
    setFilteredDocuments((prev) => [document, ...prev]);
    setActiveTab('documents');
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">
          Upload, organize, and manage your documents by type and entity.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['documents', 'upload', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab === 'documents' && `📄 Documents (${documents.length})`}
            {tab === 'upload' && '⬆️ Upload'}
            {tab === 'stats' && '📊 Statistics'}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Documents tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <DocumentSearch onSearch={handleSearch} isLoading={isLoading} />

          {/* View controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['grid', 'list'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as ViewType)}
                  className={`px-4 py-2 rounded transition-colors ${
                    view === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {v === 'grid' ? '⊞' : '≡'} {v}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'date' | 'name' | 'size' | 'type')
                }
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
                <option value="type">Sort by Type</option>
              </select>
            </div>
          </div>

          {/* Documents display */}
          {isLoading ? (
            <div className="text-center py-8">Loading documents...</div>
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              view={view}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onSelect={(id) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) {
                    next.delete(id);
                  } else {
                    next.add(id);
                  }
                  return next;
                });
              }}
              selectedIds={selectedIds}
            />
          )}
        </div>
      )}

      {/* Upload tab */}
      {activeTab === 'upload' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <DocumentUploader
            entityId={entityId}
            propertyId={propertyId}
            onUploadComplete={handleUploadComplete}
            onUploadError={(error) => setError(error)}
          />
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <DocumentStats entityId={entityId} entitySlug={entitySlug} />
      )}
    </div>
  );
}
