'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate, PROPERTY_TYPES } from '@/lib/utils';
import type { PropertyWithRelations, Entity, Property } from '@/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entitySlug = params.entity as string;
  const propertyId = params.id as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [property, setProperty] = useState<PropertyWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mortgage' | 'insurance' | 'utilities' | 'tenant' | 'documents'>('overview');
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<Partial<Property>>({});

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
      }

      // Get property
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propData) {
        setProperty(propData);
        setFormData(propData);

        // Fetch related data
        const [mortgages, insurance, utilities, tenants, documents] = await Promise.all([
          supabase.from('mortgages').select('*').eq('property_id', propertyId),
          supabase.from('insurance_policies').select('*').eq('property_id', propertyId),
          supabase.from('utilities').select('*').eq('property_id', propertyId),
          supabase.from('tenants').select('*').eq('property_id', propertyId),
          supabase.from('documents').select('*').eq('property_id', propertyId),
        ]);

        setProperty((prev) => ({
          ...prev!,
          mortgages: mortgages.data || [],
          insurance: insurance.data || [],
          utilities: utilities.data || [],
          tenants: tenants.data || [],
          documents: documents.data || [],
        }));
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug, propertyId]);

  const handleFormChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!property) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.address) {
        setError('Address is required');
        setIsSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('properties')
        .update({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          property_type: formData.property_type,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_footage: formData.square_footage,
          purchase_price: formData.purchase_price,
          purchase_date: formData.purchase_date,
          current_estimated_value: formData.current_estimated_value,
          is_occupied: formData.is_occupied,
          is_listed: formData.is_listed,
          notes: formData.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', property.id);

      if (updateError) {
        setError(updateError.message);
        setIsSaving(false);
        return;
      }

      setProperty((prev) => ({
        ...prev!,
        ...formData,
      }));
      setIsEditMode(false);
      setSuccess('Property updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(property || {});
    setIsEditMode(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!property || !entity) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href={`/${entitySlug}/properties`}>
          <button className="btn btn-ghost btn-sm mb-4">← Back to Properties</button>
        </Link>

        <div className="flex-between items-start">
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleFormChange('address', e.target.value)}
                className="input text-3xl font-bold mb-2 w-full max-w-2xl"
                placeholder="Property address"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
            )}
            {isEditMode ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  className="input input-sm w-32"
                  placeholder="City"
                />
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleFormChange('state', e.target.value)}
                  className="input input-sm w-20"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={formData.zip_code || ''}
                  onChange={(e) => handleFormChange('zip_code', e.target.value)}
                  className="input input-sm w-32"
                  placeholder="ZIP"
                />
              </div>
            ) : (
              <p className="text-gray-600 mt-1">
                {property.city}, {property.state} {property.zip_code}
              </p>
            )}
          </div>

          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="btn btn-primary btn-sm"
            >
              ✎ Edit
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="card mb-4 bg-red-50 border border-red-200 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="card mb-4 bg-green-50 border border-green-200 text-green-800">
          {success}
        </div>
      )}

      {/* Key Stats */}
      <div className="grid-3 mb-8">
        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Current Value</div>
          {isEditMode ? (
            <input
              type="number"
              value={formData.current_estimated_value || ''}
              onChange={(e) => handleFormChange('current_estimated_value', e.target.value ? Number(e.target.value) : undefined)}
              className="input input-sm w-full"
              placeholder="0.00"
            />
          ) : (
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(property.current_estimated_value)}</div>
          )}
          <div className="text-xs text-gray-600 mt-1">Purchase: {formatCurrency(property.purchase_price)}</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Status</div>
          {isEditMode ? (
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_occupied || false}
                  onChange={(e) => handleFormChange('is_occupied', e.target.checked)}
                  className="checkbox"
                />
                <span className="text-sm">Occupied</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_listed || false}
                  onChange={(e) => handleFormChange('is_listed', e.target.checked)}
                  className="checkbox"
                />
                <span className="text-sm">For Sale</span>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <span className={`badge ${property.is_occupied ? 'badge-success' : 'badge-warning'}`}>
                {property.is_occupied ? 'Occupied' : 'Vacant'}
              </span>
              {property.is_listed && <span className="badge badge-primary">For Sale</span>}
            </div>
          )}
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Property Details</div>
          {isEditMode ? (
            <div className="space-y-2 mt-2">
              <input
                type="number"
                value={formData.bedrooms || ''}
                onChange={(e) => handleFormChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="input input-sm w-full"
                placeholder="Bedrooms"
              />
              <input
                type="number"
                value={formData.bathrooms || ''}
                onChange={(e) => handleFormChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="input input-sm w-full"
                placeholder="Bathrooms"
              />
              <input
                type="number"
                value={formData.square_footage || ''}
                onChange={(e) => handleFormChange('square_footage', e.target.value ? Number(e.target.value) : undefined)}
                className="input input-sm w-full"
                placeholder="Square feet"
              />
            </div>
          ) : (
            <div className="text-sm text-gray-700 mt-2">
              {property.bedrooms && <p>Beds: {property.bedrooms}</p>}
              {property.bathrooms && <p>Baths: {property.bathrooms}</p>}
              {property.square_footage && <p>SF: {property.square_footage.toLocaleString()}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Edit Actions */}
      {isEditMode && (
        <div className="card mb-6 bg-gray-50 flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-gray-200 mb-6 -m-6 mb-6 p-6 pb-0 overflow-x-auto">
          {(['overview', 'mortgage', 'insurance', 'utilities', 'tenant', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium capitalize border-b-2 transition whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'tenant' ? 'Tenant' : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <div className="flex-between mb-4">
                <h3 className="font-semibold text-gray-900">Property Information</h3>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="btn btn-ghost btn-sm text-blue-600"
                  >
                    Edit Details
                  </button>
                )}
              </div>
              {isEditMode ? (
                <div className="grid-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                      value={formData.property_type || ''}
                      onChange={(e) => handleFormChange('property_type', e.target.value || undefined)}
                      className="input w-full"
                    >
                      <option value="">Select type...</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchase_date ? formData.purchase_date.split('T')[0] : ''}
                      onChange={(e) => handleFormChange('purchase_date', e.target.value || undefined)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input
                      type="number"
                      value={formData.purchase_price || ''}
                      onChange={(e) => handleFormChange('purchase_price', e.target.value ? Number(e.target.value) : undefined)}
                      className="input w-full"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid-2 text-sm">
                  <div>
                    <span className="text-gray-600">Property Type:</span>
                    <p className="font-medium text-gray-900">{property.property_type || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Purchase Date:</span>
                    <p className="font-medium text-gray-900">{formatDate(property.purchase_date) || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Purchase Price:</span>
                    <p className="font-medium text-gray-900">{formatCurrency(property.purchase_price)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              {isEditMode ? (
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleFormChange('notes', e.target.value || undefined)}
                  className="input w-full min-h-24"
                  placeholder="Property notes..."
                />
              ) : (
                <p className="text-gray-700">{property.notes || 'No notes'}</p>
              )}
            </div>
          </div>
        )}

        {/* Mortgage Tab */}
        {activeTab === 'mortgage' && (
          <div>
            {property.mortgages && property.mortgages.length > 0 ? (
              property.mortgages.map((mortgage) => (
                <div key={mortgage.id} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{mortgage.lender_name}</h3>
                    <div className="grid-2 text-sm">
                      <div>
                        <span className="text-gray-600">Current Balance:</span>
                        <p className="font-medium text-gray-900">{formatCurrency(mortgage.current_balance)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <p className="font-medium text-gray-900">{mortgage.interest_rate?.toFixed(3)}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Payment:</span>
                        <p className="font-medium text-gray-900">{formatCurrency(mortgage.monthly_payment)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Loan Officer:</span>
                        <p className="font-medium text-gray-900">{mortgage.loan_officer_name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No mortgage information</p>
            )}
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <div>
            {property.insurance && property.insurance.length > 0 ? (
              property.insurance.map((policy) => (
                <div key={policy.id} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{policy.insurance_company}</h3>
                    <div className="grid_2 text-sm">
                      <div>
                        <span className="text-gray-600">Policy #:</span>
                        <p className="font-medium text-gray-900">{policy.policy_number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Annual Premium:</span>
                        <p className="font-medium text-gray-900">{formatCurrency(policy.annual_premium)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Agent:</span>
                        <p className="font-medium text-gray-900">{policy.agent_name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Agent Phone:</span>
                        <p className="font-medium text-gray-900">{policy.agent_phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No insurance information</p>
            )}
          </div>
        )}

        {/* Utilities Tab */}
        {activeTab === 'utilities' && (
          <div>
            {property.utilities && property.utilities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Provider</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Account #</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Avg Monthly</th>
                      <th className="text-left py-2 font-semibold text-gray-700">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {property.utilities.map((utility) => (
                      <tr key={utility.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2">{utility.utility_type}</td>
                        <td className="py-2">{utility.provider_name}</td>
                        <td className="py-2">{utility.account_number || 'N/A'}</td>
                        <td className="py-2">{formatCurrency(utility.average_monthly_cost)}</td>
                        <td className="py-2">{utility.billing_phone || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No utility information</p>
            )}
          </div>
        )}

        {/* Tenant Tab */}
        {activeTab === 'tenant' && (
          <div>
            {property.tenants && property.tenants.length > 0 ? (
              property.tenants.map((tenant) => (
                <div key={tenant.id} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{tenant.full_name}</h3>
                    <div className="grid_2 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{tenant.email || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium text-gray-900">{tenant.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Rent:</span>
                        <p className="font-medium text-gray-900">{formatCurrency(tenant.monthly_rent)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Lease Period:</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(tenant.lease_start_date)} - {formatDate(tenant.lease_end_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No tenant information</p>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            {property.documents && property.documents.length > 0 ? (
              <div className="space-y-2">
                {property.documents.map((doc) => (
                  <div key={doc.id} className="p-4 border border-gray-200 rounded hover:bg-gray-50">
                    <div className="flex-between">
                      <div>
                        <p className="font-medium text-gray-900">{doc.file_name}</p>
                        <p className="text-sm text-gray-600">{doc.document_type} • {formatDate(doc.document_date)}</p>
                      </div>
                      <button className="btn btn-ghost btn-sm">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No documents uploaded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
