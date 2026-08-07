'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency, FINANCIAL_RECORD_TYPES } from '@/lib/utils';
import type { Entity, FinancialRecord } from '@/types';

export default function FinancialsPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [year, setYear] = useState<number>(new Date().getFullYear());

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

        // Get financial records
        const { data: recordsData } = await supabase
          .from('financial_records')
          .select('*')
          .eq('entity_id', entityData.id)
          .order('transaction_date', { ascending: false });

        if (recordsData) {
          setRecords(recordsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  const filteredRecords = records
    .filter((r) => {
      if (filter === 'all') return true;
      return r.record_type === filter;
    })
    .filter((r) => {
      const recordYear = new Date(r.transaction_date).getFullYear();
      return recordYear === year;
    });

  const stats = {
    income: filteredRecords
      .filter((r) => r.record_type === 'income')
      .reduce((sum, r) => sum + (r.amount || 0), 0),
    expenses: filteredRecords
      .filter((r) => ['piti_payment', 'utility_expense', 'repair', 'renovation', 'property_tax', 'expense'].includes(r.record_type))
      .reduce((sum, r) => sum + (r.amount || 0), 0),
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
      <div className="flex-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Financials</h2>
        <div>
          <select
            className="input"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            style={{ width: '150px' }}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid_2 mb-8">
        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Total Income</div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.income)}</div>
          <div className="text-xs text-gray-600 mt-1">Rental income for {year}</div>
        </div>

        <div className="card">
          <div className="text-gray-600 text-sm font-semibold mb-1">Total Expenses</div>
          <div className="text-3xl font-bold text-red-600">{formatCurrency(stats.expenses)}</div>
          <div className="text-xs text-gray-600 mt-1">All expenses for {year}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn ${filter === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {FINANCIAL_RECORD_TYPES.map((type) => (
            <button
              key={type.value}
              className={`btn ${filter === type.value ? 'btn-accent' : 'btn-secondary'} btn-sm`}
              onClick={() => setFilter(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-600">No records found</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{new Date(record.transaction_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {FINANCIAL_RECORD_TYPES.find((t) => t.value === record.record_type)?.label || record.record_type}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.description || '-'}</td>
                  <td className={`py-3 px-4 text-sm font-medium text-right ${
                    record.record_type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.record_type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(record.amount || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Row */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex-between font-semibold">
            <span>Net Income ({year})</span>
            <span className={stats.income - stats.expenses > 0 ? 'text-green-600' : 'text-red-600'}>
              {formatCurrency(stats.income - stats.expenses)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
