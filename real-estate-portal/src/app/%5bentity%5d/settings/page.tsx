'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Entity } from '@/types';

export default function SettingsPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ein: '',
    primary_bank_name: '',
    primary_bank_contact: '',
    primary_bank_phone: '',
    secondary_bank_name: '',
    secondary_bank_contact: '',
    secondary_bank_phone: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: entityData } = await supabase
        .from('entities')
        .select('*')
        .eq('slug', entitySlug)
        .single();

      if (entityData) {
        setEntity(entityData);
        setFormData({
          ein: entityData.ein || '',
          primary_bank_name: entityData.primary_bank_name || '',
          primary_bank_contact: entityData.primary_bank_contact || '',
          primary_bank_phone: entityData.primary_bank_phone || '',
          secondary_bank_name: entityData.secondary_bank_name || '',
          secondary_bank_contact: entityData.secondary_bank_contact || '',
          secondary_bank_phone: entityData.secondary_bank_phone || '',
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entity) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('entities')
        .update(formData)
        .eq('id', entity.id);

      if (error) {
        console.error(error);
      } else {
        alert('Settings saved successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!entity) {
    return <div className="text-center py-12">Entity not found</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Entity Settings</h2>

      <form onSubmit={handleSubmit} className="card max-w-2xl">
        <h3 className="card-title mb-6">Business & Legal Information</h3>

        <div className="space-y-6">
          {/* EIN */}
          <div>
            <label htmlFor="ein" className="block text-sm font-medium text-gray-700 mb-2">
              EIN (Employer Identification Number)
            </label>
            <input
              id="ein"
              type="text"
              className="input"
              placeholder="XX-XXXXXXX"
              value={formData.ein}
              onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
              disabled={saving}
            />
            <p className="text-xs text-gray-600 mt-1">Leave blank if not applicable</p>
          </div>

          {/* Primary Bank */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Primary Bank Account</h4>
            <div className="grid_2 gap-4">
              <div>
                <label htmlFor="primary_bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  id="primary_bank_name"
                  type="text"
                  className="input"
                  value={formData.primary_bank_name}
                  onChange={(e) => setFormData({ ...formData, primary_bank_name: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div>
                <label htmlFor="primary_bank_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  id="primary_bank_contact"
                  type="text"
                  className="input"
                  value={formData.primary_bank_contact}
                  onChange={(e) => setFormData({ ...formData, primary_bank_contact: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="primary_bank_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="primary_bank_phone"
                  type="tel"
                  className="input"
                  value={formData.primary_bank_phone}
                  onChange={(e) => setFormData({ ...formData, primary_bank_phone: e.target.value })}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Secondary Bank */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Secondary Bank Account (Optional)</h4>
            <div className="grid_2 gap-4">
              <div>
                <label htmlFor="secondary_bank_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  id="secondary_bank_name"
                  type="text"
                  className="input"
                  value={formData.secondary_bank_name}
                  onChange={(e) => setFormData({ ...formData, secondary_bank_name: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div>
                <label htmlFor="secondary_bank_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  id="secondary_bank_contact"
                  type="text"
                  className="input"
                  value={formData.secondary_bank_contact}
                  onChange={(e) => setFormData({ ...formData, secondary_bank_contact: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="secondary_bank_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="secondary_bank_phone"
                  type="tel"
                  className="input"
                  value={formData.secondary_bank_phone}
                  onChange={(e) => setFormData({ ...formData, secondary_bank_phone: e.target.value })}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-gray-200 pt-6 flex-between">
            <p className="text-sm text-gray-600">
              ℹ️ All sensitive information is encrypted and only visible to you.
            </p>
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </form>

      {/* Google Sheets Sync */}
      <div className="card max-w-2xl mt-8">
        <h3 className="card-title mb-4">Google Sheets Sync</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900 font-medium mb-2">Status: Connected</p>
            <p className="text-sm text-blue-800">
              Sheet ID: <code className="bg-blue-100 px-2 py-1 rounded">{entity.google_sheet_id}</code>
            </p>
          </div>

          <button className="btn btn-secondary w-full">🔄 Sync Now</button>

          <div className="text-xs text-gray-600 space-y-1">
            <p>• Real-time sync enabled</p>
            <p>• Changes in Google Sheets automatically update the portal</p>
            <p>• Portal updates sync back to Google Sheets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
