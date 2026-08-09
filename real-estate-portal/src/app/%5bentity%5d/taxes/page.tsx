'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface TaxDocument {
  id: string;
  tax_year: number;
  document_type: string;
  file_name: string;
  file_type: string;
  file_size: number;
  description: string;
  uploaded_by: string;
  is_final: boolean;
  created_at: string;
}

interface TaxPackage {
  id: string;
  tax_year: number;
  status: 'draft' | 'ready_for_cpa' | 'shared' | 'delivered';
  cpa_access_expires_at?: string;
  package_notes: string;
  created_at: string;
}

interface TaxChecklist {
  category: string;
  items: {
    name: string;
    required: boolean;
    completed: boolean;
  }[];
}

export default function TaxesPage() {
  const params = useParams();
  const entity = params.entity as string;

  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [taxPackages, setTaxPackages] = useState<TaxPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('documents'); // 'documents', 'checklist', 'packages'
  const [entityId, setEntityId] = useState<string>('');

  const taxChecklist: TaxChecklist[] = [
    {
      category: 'Income Documents',
      items: [
        { name: '1099 Forms from all sources', required: true, completed: false },
        { name: 'Rental income statements', required: true, completed: false },
        { name: 'K-1 Forms (if applicable)', required: false, completed: false },
      ],
    },
    {
      category: 'Expense Documents',
      items: [
        { name: 'Mortgage interest statements', required: true, completed: false },
        { name: 'Property tax receipts', required: true, completed: false },
        { name: 'Insurance premium statements', required: true, completed: false },
        { name: 'Maintenance and repair invoices', required: true, completed: false },
        { name: 'Utility bills', required: true, completed: false },
        { name: 'Management fees', required: false, completed: false },
      ],
    },
    {
      category: 'Loan & Mortgage',
      items: [
        { name: 'Mortgage statement (year-end)', required: true, completed: false },
        { name: 'Loan payoff statements', required: false, completed: false },
        { name: 'PMI payment records', required: false, completed: false },
      ],
    },
    {
      category: 'Business Records',
      items: [
        { name: 'Business license and registrations', required: false, completed: false },
        { name: 'Entity formation documents', required: false, completed: false },
        { name: 'Partnership/LLC agreement', required: false, completed: false },
      ],
    },
  ];

  useEffect(() => {
    const loadTaxData = async () => {
      try {
        const { data: entityRes } = await supabase
          .from('entities')
          .select('id')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          setEntityId(entityRes.id);

          // Get tax documents
          const { data: docsRes } = await supabase
            .from('tax_documents')
            .select('*')
            .eq('entity_id', entityRes.id)
            .eq('tax_year', selectedYear)
            .order('created_at', { ascending: false });

          setDocuments(docsRes || []);

          // Get tax packages
          const { data: pkgsRes } = await supabase
            .from('tax_packages')
            .select('*')
            .eq('entity_id', entityRes.id)
            .eq('tax_year', selectedYear)
            .single();

          if (pkgsRes) {
            setTaxPackages([pkgsRes]);
          }
        }
      } catch (error) {
        console.error('Error loading tax data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTaxData();
  }, [entity, selectedYear]);

  const generateCPAToken = async () => {
    const token = `cpa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day access

    if (taxPackages.length > 0) {
      // Update existing package
      await supabase
        .from('tax_packages')
        .update({
          cpa_access_token: token,
          cpa_access_expires_at: expiresAt.toISOString(),
          status: 'shared',
        })
        .eq('id', taxPackages[0].id);
    } else {
      // Create new package
      await supabase.from('tax_packages').insert([
        {
          entity_id: entityId,
          tax_year: selectedYear,
          cpa_access_token: token,
          cpa_access_expires_at: expiresAt.toISOString(),
          status: 'shared',
        },
      ]);
    }

    alert(
      `CPA Access Token Generated!\n\nShare this link with your CPA:\n\nreal-estate-portal.vercel.app/cpa-access?token=${token}`,
    );
  };

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const currentPackage = taxPackages[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tax Documents</h1>
            <p className="text-gray-600 mt-1">Organize and manage tax documents for your CPA</p>
          </div>
        </div>

        {/* Year Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input max-w-xs"
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'documents', label: 'Documents', icon: '📄' },
              { id: 'checklist', label: 'Checklist', icon: '✓' },
              { id: 'packages', label: 'CPA Packages', icon: '📦' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Tax Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">Click or drag files here</p>
                  <p className="text-xs text-gray-500">PDF, Excel, Image (Max 10MB)</p>
                </div>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents ({documents.length})</h3>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex-between items-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{doc.file_name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="badge badge-primary">{doc.document_type}</span>
                          <span className="text-gray-500 mx-2">
                            {(doc.file_size / 1024).toFixed(2)} KB
                          </span>
                          <span className="text-gray-500">
                            Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-ghost">Download</button>
                        <button className="btn btn-sm btn-ghost text-red-600">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Use this checklist to ensure you have all required documents for {selectedYear} taxes
              </p>

              <div className="space-y-8">
                {taxChecklist.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{section.category}</h3>
                    <div className="space-y-3 ml-4">
                      {section.items.map((item, itemIdx) => (
                        <label key={itemIdx} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={item.completed} />
                          <span className={`text-sm ${item.required ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {item.name}
                            {item.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="btn btn-primary">Save Checklist Progress</button>
              </div>
            </div>
          )}

          {/* CPA Packages Tab */}
          {activeTab === 'packages' && (
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Create and share tax packages with your CPA using secure time-limited access tokens
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Share with CPA (Peter Pietryka)</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Generate a secure link that expires in 30 days. Your CPA can access only tax documents.
                </p>
                <button onClick={generateCPAToken} className="btn btn-primary">
                  Generate CPA Access Link
                </button>
              </div>

              {currentPackage && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">Tax Year {selectedYear} Package</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Status: <span className="font-semibold">{currentPackage.status}</span>
                      </p>
                    </div>
                    <span
                      className={`badge ${
                        currentPackage.status === 'shared' ? 'badge-success' : 'badge-ghost'
                      }`}
                    >
                      {currentPackage.status === 'shared' ? '✓ Shared' : 'Not Shared'}
                    </span>
                  </div>

                  {currentPackage.cpa_access_expires_at && (
                    <div className="text-sm text-gray-600 mb-4">
                      CPA access expires:{' '}
                      <span className="font-semibold">
                        {format(new Date(currentPackage.cpa_access_expires_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="btn btn-secondary">View Package Contents</button>
                    <button className="btn btn-secondary">Revoke CPA Access</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
