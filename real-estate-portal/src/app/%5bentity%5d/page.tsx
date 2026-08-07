'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import type { Property, Entity } from '@/types';

export default function DashboardPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    totalPortfolioValue: 0,
    vacancies: 0,
  });

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

          // Calculate stats
          const occupied = propsData.filter((p) => p.is_occupied).length;
          const vacant = propsData.filter((p) => !p.is_occupied).length;
          const totalValue = propsData.reduce((sum, p) => sum + (p.current_estimated_value || 0), 0);

          setStats({
            totalProperties: propsData.length,
            occupiedProperties: occupied,
            totalPortfolioValue: totalValue,
            vacancies: vacant,
          });
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid-2 mb-8">
        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Total Properties</div>
          <div className="text-4xl font-bold text-gray-900">{stats.totalProperties}</div>
          <div className="text-xs text-gray-600 mt-2">{stats.occupiedProperties} occupied • {stats.vacancies} vacant</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Portfolio Value</div>
          <div className="text-4xl font-bold text-gray-900">{formatCurrency(stats.totalPortfolioValue, 0)}</div>
          <div className="text-xs text-gray-600 mt-2">Total estimated value</div>
        </div>
      </div>

      {/* Properties Overview */}
      <div className="card">
        <div className="card-header">
          <div className="flex-between">
            <div>
              <h3 className="card-title">Properties</h3>
              <p className="card-description">All properties in this entity</p>
            </div>
            <Link href={`/${entitySlug}/properties`}>
              <button className="btn btn-accent btn-sm">View All →</button>
            </Link>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-600">No properties yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Est. Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 5).map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{property.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{property.property_type || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                      {formatCurrency(property.current_estimated_value)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`badge ${property.is_occupied ? 'badge-success' : 'badge-warning'}`}>
                        {property.is_occupied ? 'Occupied' : 'Vacant'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/${entitySlug}/properties/${property.id}`}>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          View →
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 card">
        <h3 className="card-title mb-4">Quick Actions</h3>
        <div className="grid-3">
          <Link href={`/${entitySlug}/properties`}>
            <button className="btn btn-secondary w-full text-left">📋 Browse Properties</button>
          </Link>
          <Link href={`/${entitySlug}/documents`}>
            <button className="btn btn-secondary w-full text-left">📄 Upload Documents</button>
          </Link>
          <Link href={`/${entitySlug}/settings`}>
            <button className="btn btn-secondary w-full text-left">⚙️ Entity Settings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
