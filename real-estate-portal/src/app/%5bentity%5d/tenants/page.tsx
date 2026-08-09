'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Tenant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  property_id: string;
  property_address?: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  notes: string;
}

export default function TenantsPage() {
  const params = useParams();
  const entity = params.entity as string;

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'expiring_soon', 'expired'
  const [showForm, setShowForm] = useState(false);
  const [entityId, setEntityId] = useState<string>('');

  useEffect(() => {
    const loadTenants = async () => {
      try {
        // Get entity ID
        const { data: entityRes } = await supabase
          .from('entities')
          .select('id')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          setEntityId(entityRes.id);

          // Get all properties for this entity
          const { data: properties } = await supabase
            .from('properties')
            .select('id, address')
            .eq('entity_id', entityRes.id);

          // Get tenants
          const { data: tenantsRes } = await supabase
            .from('tenants')
            .select('*')
            .in('property_id', properties?.map((p) => p.id) || [])
            .order('lease_end_date', { ascending: true });

          // Merge with property info
          const enriched = tenantsRes?.map((tenant) => ({
            ...tenant,
            property_address: properties?.find((p) => p.id === tenant.property_id)?.address,
          })) || [];

          setTenants(enriched);
        }
      } catch (error) {
        console.error('Error loading tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [entity]);

  const filteredTenants = tenants.filter((tenant) => {
    const now = new Date();
    const leaseEnd = new Date(tenant.lease_end_date);
    const daysUntilExpiry = Math.floor((leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    switch (filter) {
      case 'active':
        return leaseEnd > now;
      case 'expiring_soon':
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
      case 'expired':
        return leaseEnd <= now;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        {/* Header */}
        <div className="flex-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600 mt-1">Manage tenant information and leases</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Tenant'}
          </button>
        </div>

        {/* Add Tenant Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Tenant</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="input" />
              <input type="email" placeholder="Email" className="input" />
              <input type="tel" placeholder="Phone" className="input" />
              <input type="number" placeholder="Monthly Rent" className="input" />
              <input type="date" placeholder="Lease Start Date" className="input" />
              <input type="date" placeholder="Lease End Date" className="input" />
              <input type="number" placeholder="Deposit Amount" className="input" />
              <select className="input">
                <option>Select Property</option>
                {/* Properties will be populated from state */}
              </select>
            </div>
            <textarea placeholder="Notes" className="input mt-4 h-24"></textarea>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary">Save Tenant</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'expiring_soon', 'expired'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`badge ${filter === f ? 'badge-primary' : 'badge-ghost'}`}
            >
              {f === 'all' && 'All Tenants'}
              {f === 'active' && 'Active'}
              {f === 'expiring_soon' && 'Expiring Soon'}
              {f === 'expired' && 'Expired'}
            </button>
          ))}
        </div>

        {/* Tenants List */}
        <div className="grid gap-4">
          {filteredTenants.length > 0 ? (
            filteredTenants.map((tenant) => {
              const leaseEnd = new Date(tenant.lease_end_date);
              const now = new Date();
              const daysUntilExpiry = Math.floor((leaseEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
              const isExpired = leaseEnd <= now;

              return (
                <div
                  key={tenant.id}
                  className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                    isExpired
                      ? 'border-red-600'
                      : isExpiringSoon
                        ? 'border-amber-600'
                        : 'border-green-600'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-gray-600 text-sm font-medium">Tenant Name</div>
                      <div className="font-semibold text-gray-900">{tenant.full_name}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm font-medium">Property</div>
                      <div className="font-semibold text-gray-900">{tenant.property_address}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm font-medium">Monthly Rent</div>
                      <div className="font-semibold text-gray-900">
                        ${tenant.monthly_rent.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm font-medium">Lease Ends</div>
                      <div className="font-semibold text-gray-900">
                        {format(new Date(tenant.lease_end_date), 'MMM d, yyyy')}
                      </div>
                      {isExpiringSoon && (
                        <div className="text-xs text-amber-600 font-semibold mt-1">
                          {daysUntilExpiry} days remaining
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4 flex-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Email: </span>
                      <span className="text-gray-900 font-medium">{tenant.email || 'N/A'}</span>
                      <span className="text-gray-600 mx-2">|</span>
                      <span className="text-gray-600">Phone: </span>
                      <span className="text-gray-900 font-medium">{tenant.phone || 'N/A'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-ghost">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">No tenants found</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                + Add First Tenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
