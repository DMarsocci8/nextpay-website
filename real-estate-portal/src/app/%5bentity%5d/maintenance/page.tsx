'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface MaintenanceRecord {
  id: string;
  property_id: string;
  property_address: string;
  maintenance_type: string;
  description: string;
  category: string;
  requested_date: string;
  scheduled_date: string;
  completed_date: string;
  contractor_id?: string;
  estimated_cost: number;
  actual_cost: number;
  priority: 'low' | 'normal' | 'high' | 'emergency';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

export default function MaintenancePage() {
  const params = useParams();
  const entity = params.entity as string;

  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'in_progress', 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadMaintenance = async () => {
      try {
        const { data: entityRes } = await supabase
          .from('entities')
          .select('id')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          // Get all properties
          const { data: properties } = await supabase
            .from('properties')
            .select('id, address')
            .eq('entity_id', entityRes.id);

          // Get maintenance records
          const { data: maintenanceRes } = await supabase
            .from('maintenance_records')
            .select('*')
            .in('property_id', properties?.map((p) => p.id) || [])
            .order('requested_date', { ascending: false });

          // Enrich with property info
          const enriched = maintenanceRes?.map((m) => ({
            ...m,
            property_address: properties?.find((p) => p.id === m.property_id)?.address || 'Unknown',
          })) || [];

          setMaintenance(enriched);
        }
      } catch (error) {
        console.error('Error loading maintenance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaintenance();
  }, [entity]);

  const filteredMaintenance = maintenance.filter((m) => {
    const statusMatch = filter === 'all' || m.status === filter;
    const priorityMatch = priorityFilter === 'all' || m.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'badge-error';
      case 'high':
        return 'badge-warning';
      case 'normal':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in_progress':
        return 'badge-primary';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Tracking</h1>
            <p className="text-gray-600 mt-1">Track maintenance requests and projects</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Log Maintenance'}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Log New Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="input" placeholder="Select Property">
                <option>Select Property</option>
              </select>
              <select className="input" placeholder="Maintenance Type">
                <option>Preventive</option>
                <option>Corrective</option>
                <option>Emergency</option>
                <option>Upgrade</option>
              </select>
              <select className="input" placeholder="Category">
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>HVAC</option>
                <option>Roof</option>
                <option>Foundation</option>
                <option>Other</option>
              </select>
              <select className="input" placeholder="Priority">
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
                <option>Emergency</option>
              </select>
              <input type="date" placeholder="Requested Date" className="input" />
              <input type="date" placeholder="Scheduled Date" className="input" />
              <input type="number" placeholder="Estimated Cost" className="input" />
            </div>
            <textarea
              placeholder="Description and notes"
              className="input mt-4 h-24"
            ></textarea>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary">Save Maintenance</button>
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Priorities</option>
                <option value="emergency">Emergency</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn btn-secondary w-full">Apply Filters</button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm font-medium mb-1">Total</div>
            <div className="text-2xl font-bold text-gray-900">{maintenance.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm font-medium mb-1">Pending</div>
            <div className="text-2xl font-bold text-amber-600">
              {maintenance.filter((m) => m.status === 'pending').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm font-medium mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">
              {maintenance.filter((m) => m.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-gray-600 text-sm font-medium mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              {maintenance.filter((m) => m.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Maintenance List */}
        <div className="space-y-4">
          {filteredMaintenance.length > 0 ? (
            filteredMaintenance.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{record.description}</h3>
                        <span className={`badge ${getPriorityColor(record.priority)}`}>
                          {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                        </span>
                        <span className={`badge ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').charAt(0).toUpperCase() +
                            record.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{record.property_address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="text-gray-600 text-xs font-medium mb-1">Type</div>
                      <div className="font-semibold text-gray-900">{record.maintenance_type}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs font-medium mb-1">Category</div>
                      <div className="font-semibold text-gray-900">{record.category}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs font-medium mb-1">Requested</div>
                      <div className="font-semibold text-gray-900">
                        {format(new Date(record.requested_date), 'MMM d')}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs font-medium mb-1">Est. Cost</div>
                      <div className="font-semibold text-gray-900">
                        ${record.estimated_cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-secondary">Edit</button>
                    <button className="btn btn-sm btn-secondary">Update Status</button>
                    {record.actual_cost > 0 && (
                      <span className="text-sm text-gray-600 self-center">
                        Actual Cost: ${record.actual_cost.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 mb-4">No maintenance records found</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                + Log First Maintenance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
