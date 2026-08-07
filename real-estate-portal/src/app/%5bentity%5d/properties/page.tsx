'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import type { Property, Entity } from '@/types';

export default function PropertiesPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (propsData) {
          setProperties(propsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  const filteredProperties = properties
    .filter((p) => {
      if (filter === 'occupied') return p.is_occupied;
      if (filter === 'vacant') return !p.is_occupied;
      return true;
    })
    .filter((p) => {
      if (!searchTerm) return true;
      return p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Properties</h2>
          <p className="text-gray-600 mt-1">{filteredProperties.length} property(ies)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              className="input"
              placeholder="Search by address or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              className={`btn ${filter === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn ${filter === 'occupied' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('occupied')}
            >
              Occupied
            </button>
            <button
              className={`btn ${filter === 'vacant' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter('vacant')}
            >
              Vacant
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-600">No properties found</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filteredProperties.map((property) => (
            <Link key={property.id} href={`/${entitySlug}/properties/${property.id}`}>
              <div className="card hover:shadow-lg cursor-pointer">
                {/* Property Header */}
                <div className="flex-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{property.address}</h3>
                  <span
                    className={`badge ${property.is_occupied ? 'badge-success' : 'badge-warning'}`}
                  >
                    {property.is_occupied ? 'Occupied' : 'Vacant'}
                  </span>
                </div>

                {/* Location */}
                <p className="text-sm text-gray-600 mb-4">
                  {property.city}, {property.state} {property.zip_code}
                </p>

                {/* Property Details */}
                {(property.bedrooms || property.bathrooms || property.square_footage) && (
                  <div className="flex gap-4 mb-4 text-sm text-gray-700">
                    {property.bedrooms && <span>🛏️ {property.bedrooms} Bed</span>}
                    {property.bathrooms && <span>🚿 {property.bathrooms} Bath</span>}
                    {property.square_footage && <span>📐 {property.square_footage.toLocaleString()} sf</span>}
                  </div>
                )}

                {/* Value */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">Estimated Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(property.current_estimated_value)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
