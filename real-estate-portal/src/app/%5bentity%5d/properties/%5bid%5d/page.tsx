'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { PropertyWithRelations, Entity } from '@/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const entitySlug = params.entity as string;
  const propertyId = params.id as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [property, setProperty] = useState<PropertyWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'mortgage' | 'insurance' | 'utilities' | 'tenant' | 'documents'>('overview');

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
        <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
        <p className="text-gray-600 mt-1">
          {property.city}, {property.state} {property.zip_code}
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid-3 mb-8">
        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Current Value</div>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(property.current_estimated_value)}</div>
          <div className="text-xs text-gray-600 mt-1">Purchase: {formatCurrency(property.purchase_price)}</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Status</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${property.is_occupied ? 'badge-success' : 'badge-warning'}`}>
              {property.is_occupied ? 'Occupied' : 'Vacant'}
            </span>
            {property.is_listed && <span className="badge badge-primary">For Sale</span>}
          </div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Property Details</div>
          <div className="text-sm text-gray-700 mt-2">
            {property.bedrooms && <p>Beds: {property.bedrooms}</p>}
            {property.bathrooms && <p>Baths: {property.bathrooms}</p>}
            {property.square_footage && <p>SF: {property.square_footage.toLocaleString()}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-gray-200 mb-6 -m-6 mb-6 p-6 pb-0">
          {(['overview', 'mortgage', 'insurance', 'utilities', 'tenant', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium capitalize border-b-2 transition ${
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
              <h3 className="font-semibold text-gray-900 mb-2">Property Information</h3>
              <div className="grid-2 text-sm">
                <div>
                  <span className="text-gray-600">Property Type:</span>
                  <p className="font-medium text-gray-900">{property.property_type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Purchase Date:</span>
                  <p className="font-medium text-gray-900">{formatDate(property.purchase_date) || 'N/A'}</p>
                </div>
              </div>
            </div>

            {property.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-700">{property.notes}</p>
              </div>
            )}
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
                    <div className="grid_2 text-sm">
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
