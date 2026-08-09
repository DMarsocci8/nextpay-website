'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardMetrics {
  totalProperties: number;
  totalMortgage: number;
  totalInsurance: number;
  totalUtilities: number;
  totalRentDue: number;
  totalRentReceived: number;
  occupancyRate: number;
  averageRent: number;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'maintenance' | 'lease_expiring' | 'document_uploaded';
  title: string;
  description: string;
  date: string;
  priority?: 'high' | 'normal' | 'low';
}

export default function EntityDashboard() {
  const params = useParams();
  const entity = params.entity as string;

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityData, setEntityData] = useState<any>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get entity data
        const { data: entityRes } = await supabase
          .from('entities')
          .select('*')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          setEntityData(entityRes);

          // Get property metrics
          const { data: properties } = await supabase
            .from('properties')
            .select('*')
            .eq('entity_id', entityRes.id);

          const { data: mortgages } = await supabase
            .from('mortgages')
            .select('monthly_payment')
            .in('property_id', properties?.map((p) => p.id) || []);

          const { data: insurance } = await supabase
            .from('insurance_policies')
            .select('annual_premium')
            .in('property_id', properties?.map((p) => p.id) || []);

          const { data: utilities } = await supabase
            .from('utilities')
            .select('average_monthly_cost')
            .in('property_id', properties?.map((p) => p.id) || []);

          const { data: tenants } = await supabase
            .from('tenants')
            .select('monthly_rent')
            .in('property_id', properties?.map((p) => p.id) || []);

          const { data: payments } = await supabase
            .from('rent_payments')
            .select('amount_paid, amount_due, payment_date')
            .gte('payment_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          // Calculate metrics
          const totalMortgage =
            (mortgages?.reduce((sum, m) => sum + (m.monthly_payment || 0), 0) || 0) * 12;
          const totalInsurance = insurance?.reduce((sum, i) => sum + (i.annual_premium || 0), 0) || 0;
          const totalUtilities =
            (utilities?.reduce((sum, u) => sum + (u.average_monthly_cost || 0), 0) || 0) * 12;
          const totalRent = tenants?.reduce((sum, t) => sum + (t.monthly_rent || 0), 0) || 0;
          const totalRentReceived =
            payments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

          setMetrics({
            totalProperties: properties?.length || 0,
            totalMortgage,
            totalInsurance,
            totalUtilities,
            totalRentDue: totalRent * 12,
            totalRentReceived,
            occupancyRate: properties?.length
              ? (properties.filter((p) => p.is_occupied).length / properties.length) * 100
              : 0,
            averageRent: tenants?.length ? totalRent / tenants.length : 0,
          });

          // Build recent activity (placeholder)
          const activities: RecentActivity[] = [
            {
              id: '1',
              type: 'payment',
              title: 'Rent Payment Received',
              description: 'Monthly rent collected from tenants',
              date: new Date().toISOString(),
              priority: 'normal',
            },
            {
              id: '2',
              type: 'lease_expiring',
              title: 'Lease Expiring Soon',
              description: 'One or more leases expiring in next 30 days',
              date: new Date().toISOString(),
              priority: 'high',
            },
          ];
          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [entity]);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{entityData?.name}</h1>
          <p className="text-gray-600">{entityData?.description}</p>
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Properties</div>
              <div className="text-3xl font-bold text-gray-900">{metrics.totalProperties}</div>
              <div className="text-xs text-gray-500 mt-2">
                {metrics.occupancyRate.toFixed(0)}% occupied
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Annual Mortgage</div>
              <div className="text-3xl font-bold text-gray-900">
                ${metrics.totalMortgage.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Annual Insurance</div>
              <div className="text-3xl font-bold text-gray-900">
                ${metrics.totalInsurance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm font-medium mb-2">Average Rent</div>
              <div className="text-3xl font-bold text-gray-900">
                ${metrics.averageRent.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Link href={`/${entity}/properties`}>
                  <button className="btn btn-secondary w-full">View Properties</button>
                </Link>
                <Link href={`/${entity}/tenants`}>
                  <button className="btn btn-secondary w-full">Manage Tenants</button>
                </Link>
                <Link href={`/${entity}/maintenance`}>
                  <button className="btn btn-secondary w-full">Maintenance</button>
                </Link>
                <Link href={`/${entity}/rent-tracking`}>
                  <button className="btn btn-secondary w-full">Rent Tracking</button>
                </Link>
                <Link href={`/${entity}/documents`}>
                  <button className="btn btn-secondary w-full">Documents</button>
                </Link>
                <Link href={`/${entity}/taxes`}>
                  <button className="btn btn-secondary w-full">Taxes</button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-blue-600 pl-4 py-2">
                    <div className="flex-between mb-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      {activity.priority === 'high' && (
                        <span className="badge badge-error">Urgent</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Important Dates */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600">Next Lease Renewal</div>
                  <div className="font-semibold text-gray-900">Pending sync</div>
                </div>
                <div>
                  <div className="text-gray-600">Insurance Renewal</div>
                  <div className="font-semibold text-gray-900">Pending sync</div>
                </div>
                <div>
                  <div className="text-gray-600">Loan Payment Due</div>
                  <div className="font-semibold text-gray-900">Monthly</div>
                </div>
              </div>
            </div>

            {/* Entity Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Entity Settings</h3>
              <Link href={`/${entity}/settings`}>
                <button className="btn btn-secondary w-full">Manage Settings</button>
              </Link>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Update entity info, users, and security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
