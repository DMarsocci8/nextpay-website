'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';

interface RentRecord {
  id: string;
  tenant_id: string;
  tenant_name: string;
  property_address: string;
  payment_date: string;
  amount_due: number;
  amount_paid: number;
  payment_method: string;
  status: 'paid' | 'late' | 'pending';
  transaction_id?: string;
}

export default function RentTrackingPage() {
  const params = useParams();
  const entity = params.entity as string;

  const [rentRecords, setRentRecords] = useState<RentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [summary, setSummary] = useState({
    totalDue: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    paymentPercentage: 0,
  });

  useEffect(() => {
    const loadRentData = async () => {
      try {
        const { data: entityRes } = await supabase
          .from('entities')
          .select('id')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          // Get all properties for this entity
          const { data: properties } = await supabase
            .from('properties')
            .select('id, address')
            .eq('entity_id', entityRes.id);

          // Get all tenants
          const { data: tenants } = await supabase
            .from('tenants')
            .select('id, full_name, property_id')
            .in('property_id', properties?.map((p) => p.id) || []);

          // Get rent payments for the selected month
          const monthStart = startOfMonth(selectedMonth);
          const monthEnd = endOfMonth(selectedMonth);

          const { data: payments } = await supabase
            .from('rent_payments')
            .select('*')
            .gte('payment_date', monthStart.toISOString())
            .lte('payment_date', monthEnd.toISOString())
            .in('tenant_id', tenants?.map((t) => t.id) || []);

          // Enrich with tenant and property info
          const records: RentRecord[] = tenants?.map((tenant) => {
            const payment = payments?.find((p) => p.tenant_id === tenant.id);
            const property = properties?.find((p) => p.id === tenant.property_id);

            const amountDue = tenant.monthly_rent || 0;
            const amountPaid = payment?.amount_paid || 0;
            let status: 'paid' | 'late' | 'pending' = 'pending';

            if (amountPaid >= amountDue) {
              status = 'paid';
            } else if (payment?.payment_date && new Date(payment.payment_date) > monthEnd) {
              status = 'late';
            }

            return {
              id: payment?.id || `${tenant.id}-${selectedMonth.getTime()}`,
              tenant_id: tenant.id,
              tenant_name: tenant.full_name,
              property_address: property?.address || 'Unknown Property',
              payment_date: payment?.payment_date || monthStart.toISOString(),
              amount_due: amountDue,
              amount_paid: amountPaid,
              payment_method: payment?.payment_method || 'pending',
              status,
              transaction_id: payment?.transaction_id,
            };
          }) || [];

          setRentRecords(records);

          // Calculate summary
          const totalDue = records.reduce((sum, r) => sum + r.amount_due, 0);
          const totalPaid = records.reduce((sum, r) => sum + r.amount_paid, 0);
          const totalOutstanding = totalDue - totalPaid;

          setSummary({
            totalDue,
            totalPaid,
            totalOutstanding,
            paymentPercentage: totalDue > 0 ? (totalPaid / totalDue) * 100 : 0,
          });
        }
      } catch (error) {
        console.error('Error loading rent data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRentData();
  }, [entity, selectedMonth]);

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, 1));
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
            <h1 className="text-3xl font-bold text-gray-900">Rent Tracking</h1>
            <p className="text-gray-600 mt-1">Monthly rent roll and payment tracking</p>
          </div>
          <button className="btn btn-primary">Send Rent Roll Email</button>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex-between items-center">
            <button onClick={handlePrevMonth} className="btn btn-sm btn-ghost">
              ← Previous
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {format(selectedMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={handleNextMonth} className="btn btn-sm btn-ghost">
              Next →
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Total Due</div>
            <div className="text-3xl font-bold text-gray-900">
              ${summary.totalDue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Total Received</div>
            <div className="text-3xl font-bold text-green-600">
              ${summary.totalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Outstanding</div>
            <div
              className={`text-3xl font-bold ${
                summary.totalOutstanding > 0 ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              ${summary.totalOutstanding.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">Collection Rate</div>
            <div className="text-3xl font-bold text-blue-600">
              {summary.paymentPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Rent Roll Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Monthly Rent Roll</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Tenant</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Amount Due</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Amount Paid</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Outstanding</th>
                  <th className="px-6 py-3 text-center font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{record.tenant_name}</td>
                    <td className="px-6 py-4 text-gray-600">{record.property_address}</td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                      ${record.amount_due.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                      ${record.amount_paid.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-medium ${
                        record.amount_due - record.amount_paid > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      ${(record.amount_due - record.amount_paid).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`badge ${
                          record.status === 'paid'
                            ? 'badge-success'
                            : record.status === 'late'
                              ? 'badge-error'
                              : 'badge-warning'
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.payment_method === 'pending' ? '—' : record.payment_method}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rentRecords.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No rent records found for this period</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-secondary">Record Manual Payment</button>
            <button className="btn btn-secondary">Send Late Notice</button>
            <button className="btn btn-secondary">Export to CSV</button>
            <button className="btn btn-secondary">Print Rent Roll</button>
          </div>
        </div>
      </div>
    </div>
  );
}
