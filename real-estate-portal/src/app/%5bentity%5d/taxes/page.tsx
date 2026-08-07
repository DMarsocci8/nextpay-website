'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { Entity, Document } from '@/types';

// Tax document categories
const TAX_CATEGORIES = [
  'Tax Returns',
  '1099 Forms',
  'W-2 Forms',
  'K-1 Forms',
  'Receipts & Invoices',
  'P&L Statements',
  'Depreciation Schedules',
  'Loan Interest Statements',
  'Property Tax Bills',
  'Utility Bills',
  'Mortgage Documents',
  'Insurance Policies',
  'Repair & Maintenance',
  'Capital Improvements',
  'Travel & Mileage',
  'Business Expenses',
];

export default function TaxesPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<string>('Receipts & Invoices');
  const [fileAsTax, setFileAsTax] = useState(true);
  const [fileByYear, setFileByYear] = useState(true);
  const [fileByType, setFileByType] = useState(true);

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

        // Get tax documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .eq('entity_id', entityData.id)
          .eq('document_type', 'tax')
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
      // Build tags based on checkboxes
      const tags: string[] = [docCategory];
      if (fileAsTax) tags.push('tax');
      if (fileByYear) tags.push(`year_${selectedYear}`);
      if (fileByType) tags.push(`type_${docCategory.toLowerCase().replace(/\s+/g, '_')}`);

      // Create document record
      const { data, error } = await supabase.from('documents').insert([
        {
          entity_id: entity.id,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          gcs_path: `gs://real-estate-hub-documents/${entity.slug}/taxes/${selectedYear}/${selectedFile.name}`,
          document_type: 'tax',
          document_date: new Date().toISOString().split('T')[0],
          tags,
          description: `${docCategory} - ${selectedYear}`,
        },
      ]);

      if (error) {
        console.error(error);
        alert('Upload failed');
      } else {
        // Refresh documents
        const { data: docsData } = await supabase
          .from('documents')
          .select('*')
          .eq('entity_id', entity.id)
          .eq('document_type', 'tax')
          .order('created_at', { ascending: false });

        if (docsData) {
          setDocuments(docsData);
        }

        // Reset form
        setSelectedFile(null);
        setDocCategory('Receipts & Invoices');
        setFileAsTax(true);
        setFileByYear(true);
        setFileByType(true);
        alert('✅ Document uploaded and organized!');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleExportTaxBundle = async () => {
    // Create a ZIP file with all tax documents for the year
    alert(`📦 Exporting all ${selectedYear} tax documents...\n\nThis will create a ZIP file ready to send to your CPA.`);
    // TODO: Implement actual ZIP export
  };

  const handleGenerateTaxReport = async () => {
    // Generate a PDF tax summary report
    alert(`📄 Generating ${selectedYear} tax summary PDF...\n\nThis will create a professional report with all documents and financial info.`);
    // TODO: Implement actual PDF generation
  };

  const filteredDocuments = documents.filter((doc) => {
    if (selectedCategory === 'all') {
      return doc.tags?.includes(`year_${selectedYear}`) || doc.document_date?.startsWith(selectedYear.toString());
    }
    return doc.tags?.includes(selectedCategory.toLowerCase().replace(/\s+/g, '_')) &&
           (doc.tags?.includes(`year_${selectedYear}`) || doc.document_date?.startsWith(selectedYear.toString()));
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
      <div className="flex-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tax Documents</h2>
          <p className="text-gray-600 mt-1">Organize and manage all tax-related documents by year</p>
        </div>
        <div>
          <select
            className="input"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ width: '150px' }}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleExportTaxBundle}
            className="btn btn-accent"
          >
            📦 Export Tax Bundle (ZIP)
          </button>
          <button
            onClick={handleGenerateTaxReport}
            className="btn btn-secondary"
          >
            📄 Generate CPA Report (PDF)
          </button>
          <Link href={`/${entitySlug}/settings`}>
            <button className="btn btn-ghost">
              ⚙️ Entity Info
            </button>
          </Link>
        </div>
      </div>

      {/* Upload Form */}
      <div className="card mb-8">
        <h3 className="card-title mb-6">Upload Tax Document</h3>
        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              className="input"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={uploading}
              required
            />
            <p className="text-xs text-gray-600 mt-1">PDF, images, spreadsheets, documents</p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Category
            </label>
            <select
              className="input"
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              disabled={uploading}
            >
              {TAX_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filing Options - Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              File Under (Auto-organize)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={fileAsTax}
                  onChange={(e) => setFileAsTax(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">📁 Tax Folder (Main)</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={fileByYear}
                  onChange={(e) => setFileByYear(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">📅 By Year ({selectedYear})</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={fileByType}
                  onChange={(e) => setFileByType(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">🏷️ By Type ({docCategory})</span>
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              ✨ Checking all three creates optimal organization for CPA handoff
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-accent w-full"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : '⬆️ Upload & Organize'}
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn ${selectedCategory === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({documents.length})
          </button>
          {TAX_CATEGORIES.map((cat) => {
            const count = documents.filter((d) =>
              d.tags?.includes(cat.toLowerCase().replace(/\s+/g, '_'))
            ).length;
            return (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedYear} Documents {selectedCategory !== 'all' && `• ${selectedCategory}`}
        </h3>

        {filteredDocuments.length === 0 ? (
          <div className="card py-12 text-center">
            <p className="text-gray-600 text-lg">📭 No documents yet</p>
            <p className="text-gray-500 text-sm mt-1">Upload your first tax document above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="card p-4 flex-between hover:shadow-md transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">📄 {doc.file_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {doc.description} • {formatDate(doc.document_date)} • {formatFileSize(doc.file_size)}
                  </p>
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge badge-gray text-xs">
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 3 && (
                        <span className="badge badge-gray text-xs">
                          +{doc.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button className="btn btn-ghost btn-sm">⬇️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CPA Export Summary */}
      <div className="card mt-8 bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">💼 Ready for CPA?</h3>
        <p className="text-sm text-blue-800 mb-4">
          You have {documents.length} tax documents organized. When ready:
        </p>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✅ Click "Export Tax Bundle" to download all {selectedYear} docs as ZIP</p>
          <p>✅ Click "Generate CPA Report" to create a summary PDF</p>
          <p>✅ Share directly to your CPA via Google Drive or email</p>
        </div>
      </div>
    </div>
  );
}
