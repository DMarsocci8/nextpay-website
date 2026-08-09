'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface BusinessLegalInfo {
  id?: string;
  entity_id: string;
  ein_encrypted?: string;
  ein_last_four?: string;
  bank_account_encrypted?: string;
  bank_account_last_four?: string;
  routing_number_encrypted?: string;
  primary_bank_name: string;
  primary_bank_contact_person: string;
  primary_bank_contact_phone: string;
  primary_bank_contact_email: string;
  secondary_bank_name?: string;
  secondary_bank_contact_person?: string;
  secondary_bank_contact_phone?: string;
  secondary_bank_contact_email?: string;
  mortgage_lender_name?: string;
  mortgage_contact_person?: string;
  mortgage_contact_phone?: string;
  mortgage_contact_email?: string;
  insurance_provider_name?: string;
  insurance_contact_phone?: string;
  insurance_contact_email?: string;
  notes?: string;
}

interface EntityInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  accent_color: string;
}

export default function EntitySettingsPage() {
  const params = useParams();
  const entity = params.entity as string;

  const [entityInfo, setEntityInfo] = useState<EntityInfo | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessLegalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('entity');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showEIN, setShowEIN] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);
  const [showRoutingNumber, setShowRoutingNumber] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get entity info
        const { data: entityRes } = await supabase
          .from('entities')
          .select('*')
          .eq('slug', entity)
          .single();

        if (entityRes) {
          setEntityInfo(entityRes);

          // Get business legal info
          const { data: businessRes } = await supabase
            .from('business_legal_info')
            .select('*')
            .eq('entity_id', entityRes.id)
            .single();

          if (businessRes) {
            setBusinessInfo(businessRes);
          } else {
            setBusinessInfo({
              entity_id: entityRes.id,
              primary_bank_name: '',
              primary_bank_contact_person: '',
              primary_bank_contact_phone: '',
              primary_bank_contact_email: '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [entity]);

  const handleBusinessInfoChange = (field: keyof BusinessLegalInfo, value: any) => {
    setBusinessInfo((prev) => (prev ? { ...prev, [field]: value } : null));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!businessInfo || !entityInfo) return;

    try {
      if (businessInfo.id) {
        await supabase.from('business_legal_info').update(businessInfo).eq('id', businessInfo.id);
      } else {
        await supabase.from('business_legal_info').insert([businessInfo]);
      }
      setUnsavedChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Entity Settings</h1>
          <p className="text-gray-600 mt-1">Manage {entityInfo?.name} configuration and information</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'entity', label: 'Entity Info' },
              { id: 'business', label: 'Business & Legal' },
              { id: 'users', label: 'Users & Access' },
              { id: 'security', label: 'Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Entity Info Tab */}
          {activeTab === 'entity' && entityInfo && (
            <div className="p-6">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Entity Name</label>
                  <input
                    type="text"
                    value={entityInfo.name}
                    className="input"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={entityInfo.slug}
                    className="input"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly identifier</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={entityInfo.description}
                    className="input"
                    rows={4}
                    disabled
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-lg shadow"
                      style={{ backgroundColor: entityInfo.accent_color }}
                    ></div>
                    <input
                      type="text"
                      value={entityInfo.accent_color}
                      className="input"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business & Legal Tab */}
          {activeTab === 'business' && businessInfo && (
            <div className="p-6">
              <div className="max-w-3xl">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>Important:</strong> Do not share EIN, bank account numbers, or routing
                    numbers with anyone. This information is encrypted and sensitive.
                  </p>
                </div>

                {/* Tax Information */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Tax Information</h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Federal Employer Identification Number (EIN)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showEIN ? 'text' : 'password'}
                        placeholder="Enter 9-digit EIN (e.g., 12-3456789)"
                        value={businessInfo.ein_encrypted || ''}
                        onChange={(e) => handleBusinessInfoChange('ein_encrypted', e.target.value)}
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEIN(!showEIN)}
                        className="btn btn-secondary btn-sm"
                      >
                        {showEIN ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Only the last 4 digits will be stored for reference
                    </p>
                  </div>
                </div>

                {/* Primary Bank */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Primary Bank Account</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Chase, Wells Fargo"
                        value={businessInfo.primary_bank_name}
                        onChange={(e) => handleBusinessInfoChange('primary_bank_name', e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={showBankAccount ? 'text' : 'password'}
                          placeholder="Full account number"
                          value={businessInfo.bank_account_encrypted || ''}
                          onChange={(e) =>
                            handleBusinessInfoChange('bank_account_encrypted', e.target.value)
                          }
                          className="input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowBankAccount(!showBankAccount)}
                          className="btn btn-secondary btn-sm"
                        >
                          {showBankAccount ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Routing Number
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={showRoutingNumber ? 'text' : 'password'}
                          placeholder="9-digit routing number"
                          value={businessInfo.routing_number_encrypted || ''}
                          onChange={(e) =>
                            handleBusinessInfoChange('routing_number_encrypted', e.target.value)
                          }
                          className="input flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRoutingNumber(!showRoutingNumber)}
                          className="btn btn-secondary btn-sm"
                        >
                          {showRoutingNumber ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        placeholder="Bank representative name"
                        value={businessInfo.primary_bank_contact_person}
                        onChange={(e) =>
                          handleBusinessInfoChange('primary_bank_contact_person', e.target.value)
                        }
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={businessInfo.primary_bank_contact_phone}
                        onChange={(e) =>
                          handleBusinessInfoChange('primary_bank_contact_phone', e.target.value)
                        }
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Email
                      </label>
                      <input
                        type="email"
                        placeholder="Email address"
                        value={businessInfo.primary_bank_contact_email}
                        onChange={(e) =>
                          handleBusinessInfoChange('primary_bank_contact_email', e.target.value)
                        }
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Mortgage Info */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Mortgage Lender</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Lender Name"
                      value={businessInfo.mortgage_lender_name || ''}
                      onChange={(e) => handleBusinessInfoChange('mortgage_lender_name', e.target.value)}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Contact Person"
                      value={businessInfo.mortgage_contact_person || ''}
                      onChange={(e) =>
                        handleBusinessInfoChange('mortgage_contact_person', e.target.value)
                      }
                      className="input"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={businessInfo.mortgage_contact_phone || ''}
                      onChange={(e) => handleBusinessInfoChange('mortgage_contact_phone', e.target.value)}
                      className="input"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={businessInfo.mortgage_contact_email || ''}
                      onChange={(e) =>
                        handleBusinessInfoChange('mortgage_contact_email', e.target.value)
                      }
                      className="input"
                    />
                  </div>
                </div>

                {/* Insurance Info */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Insurance Provider</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Insurance Company Name"
                      value={businessInfo.insurance_provider_name || ''}
                      onChange={(e) =>
                        handleBusinessInfoChange('insurance_provider_name', e.target.value)
                      }
                      className="input"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={businessInfo.insurance_contact_phone || ''}
                      onChange={(e) => handleBusinessInfoChange('insurance_contact_phone', e.target.value)}
                      className="input"
                    />
                    <textarea
                      placeholder="Notes"
                      value={businessInfo.notes || ''}
                      onChange={(e) => handleBusinessInfoChange('notes', e.target.value)}
                      className="input md:col-span-2"
                      rows={3}
                    ></textarea>
                  </div>
                </div>

                {/* Save Button */}
                {unsavedChanges && (
                  <div className="flex gap-2 pt-6 border-t border-gray-200">
                    <button onClick={handleSave} className="btn btn-primary">
                      Save Changes
                    </button>
                    <button onClick={() => setUnsavedChanges(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users & Access Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Users & Permissions</h3>
              <p className="text-gray-600 mb-6">
                Manage who has access to this entity and what permissions they have.
              </p>
              {/* User management UI will go here */}
              <button className="btn btn-primary">+ Add User</button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>

              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Two-Factor Authentication (2FA)
                      </h4>
                      <p className="text-sm text-gray-600">
                        Protect your account with an additional security layer
                      </p>
                    </div>
                    <button
                      onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                      className={`btn btn-sm ${twoFAEnabled ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {twoFAEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                  {twoFAEnabled && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        2FA is enabled. You can use Google Authenticator, Authy, or Microsoft Authenticator.
                      </p>
                    </div>
                  )}
                </div>

                {/* Activity Log */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <button className="btn btn-secondary">View Activity Log</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
