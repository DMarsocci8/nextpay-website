// Entity types
export type EntitySlug = 'doma_capital' | 'domillo_holdings' | 'jagg';

export interface Entity {
  id: string;
  slug: EntitySlug;
  name: string;
  accent_color: string;
  description?: string;
  google_sheet_id: string;
  ein?: string;
  primary_bank_name?: string;
  primary_bank_contact?: string;
  primary_bank_phone?: string;
  secondary_bank_name?: string;
  secondary_bank_contact?: string;
  secondary_bank_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_id: string;
  email: string;
  full_name?: string;
  role: 'owner' | 'collaborator';
  created_at: string;
  updated_at: string;
}

// Property types
export interface Property {
  id: string;
  entity_id: string;
  address: string;
  city?: string;
  state?: string;
  zip_code?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  purchase_price?: number;
  purchase_date?: string;
  current_estimated_value?: number;
  is_occupied: boolean;
  is_listed: boolean;
  is_archived: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyWithRelations extends Property {
  mortgages?: Mortgage[];
  insurance?: InsurancePolicy[];
  utilities?: Utility[];
  tenants?: Tenant[];
  property_managers?: PropertyManager[];
  renovations?: Renovation[];
  comparable_properties?: ComparableProperty[];
  documents?: Document[];
}

// Mortgage/Loan types
export interface Mortgage {
  id: string;
  property_id: string;
  lender_name: string;
  loan_type?: string;
  original_balance?: number;
  current_balance?: number;
  interest_rate?: number;
  loan_term_months?: number;
  monthly_payment?: number;
  loan_start_date?: string;
  loan_end_date?: string;
  account_number?: string;
  loan_officer_name?: string;
  loan_officer_phone?: string;
  loan_officer_email?: string;
  prepayment_penalty?: boolean;
  prepayment_penalty_details?: string;
  has_pmi?: boolean;
  pmi_monthly_payment?: number;
  created_at: string;
  updated_at: string;
}

export interface InsurancePolicy {
  id: string;
  property_id: string;
  insurance_company: string;
  policy_type?: string;
  policy_number?: string;
  coverage_amount?: number;
  deductible?: number;
  annual_premium?: number;
  monthly_payment?: number;
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  policy_start_date?: string;
  policy_end_date?: string;
  renewal_reminder_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Utility {
  id: string;
  property_id: string;
  utility_type: string;
  provider_name: string;
  account_number?: string;
  billing_contact?: string;
  billing_phone?: string;
  billing_email?: string;
  average_monthly_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  property_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  monthly_rent?: number;
  deposit_amount?: number;
  move_in_date?: string;
  move_out_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyManager {
  id: string;
  property_id: string;
  company_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  management_fee_percentage?: number;
  management_fee_flat?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Renovation {
  id: string;
  property_id: string;
  description: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  contractor_name?: string;
  contractor_contact?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComparableProperty {
  id: string;
  property_id: string;
  comp_address: string;
  comp_city?: string;
  comp_state?: string;
  comp_zip?: string;
  sale_price?: number;
  sale_date?: string;
  days_on_market?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
  price_per_sqft?: number;
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Document types
export type DocumentType = 'mortgage' | 'lease' | 'insurance' | 'utility' | 'renovation' | 'appraisal' | 'tax' | 'other';

export interface Document {
  id: string;
  property_id?: string;
  entity_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  gcs_path: string;
  document_type: DocumentType;
  document_date?: string;
  description?: string;
  tags?: string[];
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

// Financial record types
export type FinancialRecordType = 'piti_payment' | 'utility_expense' | 'repair' | 'renovation' | 'property_tax' | 'income' | 'expense' | 'other';

export interface FinancialRecord {
  id: string;
  property_id?: string;
  entity_id: string;
  record_type: FinancialRecordType;
  amount: number;
  transaction_date: string;
  description?: string;
  sheet_row_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  entity_id: string;
  sync_type: 'full' | 'incremental' | 'property' | 'financial';
  status: 'started' | 'completed' | 'failed';
  records_synced: number;
  error_message?: string;
  synced_at: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
