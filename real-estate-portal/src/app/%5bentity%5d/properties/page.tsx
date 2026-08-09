'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency, PROPERTY_TYPES } from '@/lib/utils';
import type { Property, Entity } from '@/types';

type SortOption = 'newest' | 'oldest' | 'address-asc' | 'address-desc' | 'value-high' | 'value-low';

export default function PropertiesPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState<'all' | 'occupied' | 'vacant'>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | 'under500k' | '500k-1m' | '1m-2m' | 'over2m'>('all');
  const [listedFilter, setListedFilter] = useState<'all' | 'listed' | 'not-listed'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Show advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Get entity
      const { data: entityData } = (await supabase
        .from('entities')
        .select('*')
        .eq('slug', entitySlug)
        .single()) as { data: Entity | null };

      if (entityData) {
        setEntity(entityData);

        // Get properties
        const { data: propsData } = (await supabase
          .from('properties')
          .select('*')
          .eq('entity_id', entityData.id)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })) as { data: Property[] | null };

        if (propsData) {
          setProperties(propsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  // Apply filters and sorting
  const filteredProperties = properties
    .filter((p) => {
      // Occupancy filter
      if (occupancyFilter === 'occupied') return p.is_occupied;
      if (occupancyFilter === 'vacant') return !p.is_occupied;
      return true;
    })
    .filter((p) => {
      // Property type filter
      if (propertyTypeFilter !== 'all' && p.property_type !== propertyTypeFilter) {
        return false;
      }
      return true;
    })
    .filter((p) => {
      // Price range filter
      const value = p.current_estimated_value || 0;
      if (priceRangeFilter === 'under500k') return value < 500000;
      if (priceRangeFilter === '500k-1m') return value >= 500000 && value < 1000000;
      if (priceRangeFilter === '1m-2m') return value >= 1000000 && value < 2000000;
      if (priceRangeFilter === 'over2m') return value >= 2000000;
      return true;
    })
    .filter((p) => {
      // Listed filter
      if (listedFilter === 'listed') return p.is_listed;
      if (listedFilter === 'not-listed') return !p.is_listed;
      return true;
    })
    .filter((p) => {
      // Search filter
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        p.address?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term) ||
        p.state?.toLowerCase().includes(term) ||
        p.zip_code?.includes(term)
      );
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'address-asc':
          return (a.address || '').localeCompare(b.address || '');
        case 'address-desc':
          return (b.address || '').localeCompare(a.address || '');
        case 'value-high':
          return (b.current_estimated_value || 0) - (a.current_estimated_value || 0);
        case 'value-low':
          return (a.current_estimated_value || 0) - (b.current_estimated_value || 0);
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const hasActiveFilters =
    searchTerm ||
    occupancyFilter !== 'all' ||
    propertyTypeFilter !== 'all' ||
    priceRangeFilter !== 'all' ||
    listedFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setOccupancyFilter('all');
    setPropertyTypeFilter('all');
    setPriceRangeFilter('all');
    setListedFilter('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Properties</h2>
          <p className="text-gray-600 mt-1">{filteredProperties.length} of {properties.length} property(ies)</p>
        </div>
      </div>

      {/* Primary Search */}
      <div className="card mb-4">
        <div className="flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Search by address, city, state, or zip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="address-asc">Address (A-Z)</option>
              <option value="address-desc">Address (Z-A)</option>
              <option value="value-high">Value (High to Low)</option>
              <option value="value-low">Value (Low to High)</option>
            </select>
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="btn btn-secondary"
          >
            {showAdvancedFilters ? '▼ Hide Filters' : '▶ More Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="card mb-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Occupancy Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy</label>
              <select
                className="input"
                value={occupancyFilter}
                onChange={(e) => setOccupancyFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                className="input"
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                className="input"
                value={priceRangeFilter}
                onChange={(e) => setPriceRangeFilter(e.target.value as any)}
              >
                <option value="all">All Prices</option>
                <option value="under500k">Under $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="1m-2m">$1M - $2M</option>
                <option value="over2m">Over $2M</option>
              </select>
            </div>

            {/* Listed Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Listing Status</label>
              <select
                className="input"
                value={listedFilter}
                onChange={(e) => setListedFilter(e.target.value as any)}
              >
                <option value="all">All Status</option>
                <option value="listed">For Sale</option>
                <option value="not-listed">Not Listed</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="btn btn-sm btn-ghost text-blue-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="badge badge-info">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-1">×</button>
            </span>
          )}
          {occupancyFilter !== 'all' && (
            <span className="badge badge-info">
              {occupancyFilter}
              <button onClick={() => setOccupancyFilter('all')} className="ml-1">×</button>
            </span>
          )}
          {propertyTypeFilter !== 'all' && (
            <span className="badge badge-info">
              {propertyTypeFilter}
              <button onClick={() => setPropertyTypeFilter('all')} className="ml-1">×</button>
            </span>
          )}
          {priceRangeFilter !== 'all' && (
            <span className="badge badge-info">
              Price: {priceRangeFilter}
              <button onClick={() => setPriceRangeFilter('all')} className="ml-1">×</button>
            </span>
          )}
          {listedFilter !== 'all' && (
            <span className="badge badge-info">
              {listedFilter}
              <button onClick={() => setListedFilter('all')} className="ml-1">×</button>
            </span>
          )}
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="card py-12 text-center">
          {hasActiveFilters ? (
            <>
              <p className="text-gray-600 mb-4">No properties match your filters</p>
              <button
                onClick={clearFilters}
                className="btn btn-secondary btn-sm"
              >
                Clear Filters
              </button>
            </>
          ) : (
            <p className="text-gray-600">No properties found</p>
          )}
        </div>
      ) : (
        <div className="grid-auto">
          {filteredProperties.map((property) => (
            <Link key={property.id} href={`/${entitySlug}/properties/${property.id}`}>
              <div className="card hover:shadow-lg hover:scale-105 cursor-pointer transition-all">
                {/* Property Header */}
                <div className="flex-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{property.address}</h3>
                  <span
                    className={`badge whitespace-nowrap ml-2 ${property.is_occupied ? 'badge-success' : 'badge-warning'}`}
                  >
                    {property.is_occupied ? 'Occupied' : 'Vacant'}
                  </span>
                </div>

                {/* Badges */}
                {property.is_listed && (
                  <div className="mb-2">
                    <span className="badge badge-primary">For Sale</span>
                  </div>
                )}

                {/* Location */}
                <p className="text-sm text-gray-600 mb-4">
                  {property.city}, {property.state} {property.zip_code}
                </p>

                {/* Property Type */}
                {property.property_type && (
                  <p className="text-xs text-gray-500 mb-3 italic">{property.property_type}</p>
                )}

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
