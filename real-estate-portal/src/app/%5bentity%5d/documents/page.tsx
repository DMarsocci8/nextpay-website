'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate, formatFileSize, DOCUMENT_TYPES } from '@/lib/utils';
import type { Document, Entity, Property } from '@/types';

export default function DocumentsPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>('other');
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      // Get entity
      const { data: entityData } = await supabase
        .from('entities')
        .select('*')
        .eq('slug', entitySlug)
        .single();

      if (entityData) {
        setEntity(entityData);

        // Get properties
        const { data: propsData } = await supabase
          .from('properties')
          .select('*')
          .eq('entity_id', entityData.id)
          .eq('is_archived', false);

        if (propsData) {
          setProperties(propsData);
        }

        // Get documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .eq('entity_id', entityData.id)
          .order('created_at', { ascending: false });

        if (docsData) {
          setDocuments(docsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !entity) return;

    setUploading(true);

    try {
      // In production, this would upload to Google Cloud Storage
      // For now, we'll create a placeholder document record
      const { data, error } = await supabase.from('documents').insert([
        {
          entity_id: entity.id,
          property_id: selectedProperty || null,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          gcs_path: `gs://${selectedFile.name}`, // Placeholder
          document_type: docType,
          tags: [],
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        // Refresh documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .eq('entity_id', entity.id)
          .order('created_at', { ascending: false });

        if (docsData) {
          setDocuments(docsData);
        }

        setSelectedFile(null);
        setDocType('other');
        setSelectedProperty('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (filter === 'all') return true;
    return doc.document_type === filter;
  });

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Documents</h2>

      {/* Upload Form */}
      <div className="card mb-8">
        <h3 className="card-title mb-4">Upload Document</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid_2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input
                type="file"
                className="input"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                disabled={uploading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select
                className="input"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                disabled={uploading}
              >
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property (Optional)</label>
              <select
                className="input"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                disabled={uploading}
              >
                <option value="">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.address}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="btn btn-accent w-full"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn ${filter === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('all')}
          >
            All ({documents.length})
          </button>
          {DOCUMENT_TYPES.map((type) => {
            const typeValue = type.toLowerCase().replace(/\s+/g, '_');
            const count = documents.filter((d) => d.document_type === typeValue).length;
            return (
              <button
                key={type}
                className={`btn ${filter === typeValue ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                onClick={() => setFilter(typeValue)}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-600">No documents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="card p-4 flex-between hover:shadow-md transition cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-900">{doc.file_name}</p>
                <p className="text-sm text-gray-600">
                  {doc.document_type} • {formatDate(doc.document_date)} • {formatFileSize(doc.file_size)}
                </p>
                {doc.description && <p className="text-sm text-gray-700 mt-1">{doc.description}</p>}
              </div>
              <button className="btn btn-ghost btn-sm">Download</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
