/**
 * Type definitions for business_legal_info table
 * Includes encrypted and decrypted variants for type safety
 */

import { UUID } from 'crypto';

/**
 * Business type enumeration
 */
export enum BusinessType {
  SOLE_PROPRIETOR = 'sole_proprietor',
  LLC = 'llc',
  PARTNERSHIP = 'partnership',
  S_CORP = 's_corp',
  C_CORP = 'c_corp',
  NON_PROFIT = 'non_profit',
  B_CORP = 'b_corp',
  COOPERATIVE = 'cooperative',
}

/**
 * Tax ID type enumeration
 */
export enum TaxIdType {
  EIN = 'ein',
  SSN = 'ssn',
  TIN = 'tin',
  ITIN = 'itin',
}

/**
 * Bank account type enumeration
 */
export enum BankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  BUSINESS = 'business',
  MONEY_MARKET = 'money_market',
}

/**
 * Filing status enumeration
 */
export enum AnnualFilingStatus {
  CURRENT = 'current',
  OVERDUE = 'overdue',
  UNKNOWN = 'unknown',
  NOT_REQUIRED = 'not_required',
}

/**
 * Audit log action enumeration
 */
export enum AuditLogAction {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DECRYPT = 'decrypt',
}

/**
 * Raw encrypted record from database
 * Contains BYTEA encrypted fields
 */
export interface BusinessLegalInfoEncrypted {
  id: string;
  entity_id: string;
  business_type: BusinessType;
  legal_business_name: string;
  dba_name?: string;
  tax_id_type?: TaxIdType;
  tax_id_encrypted?: string; // BYTEA as hex string
  tax_id_last_four?: string;
  formation_state?: string;
  formation_date?: string;
  business_license_number?: string;
  primary_bank_name?: string;
  primary_bank_routing_encrypted?: string; // BYTEA as hex string
  primary_bank_account_encrypted?: string; // BYTEA as hex string
  primary_bank_account_last_four?: string;
  primary_bank_account_type?: BankAccountType;
  secondary_bank_name?: string;
  secondary_bank_routing_encrypted?: string;
  secondary_bank_account_encrypted?: string;
  secondary_bank_account_last_four?: string;
  principal_owner_name_encrypted?: string; // BYTEA as hex string
  principal_owner_title?: string;
  principal_owner_ssn_encrypted?: string; // BYTEA as hex string
  principal_owner_ssn_last_four?: string;
  principal_owner_dob?: string; // ISO date
  business_phone?: string;
  business_email?: string;
  principal_phone_encrypted?: string;
  principal_email_encrypted?: string;
  is_registered_with_state?: boolean;
  state_registration_id?: string;
  annual_filing_status?: AnnualFilingStatus;
  last_annual_filing_date?: string; // ISO date
  has_business_insurance?: boolean;
  business_insurance_carrier?: string;
  business_insurance_policy_number?: string;
  business_insurance_expiration_date?: string; // ISO date
  legal_notes?: string;
  compliance_notes?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  last_verified_at?: string; // ISO timestamp
  verified_by?: string;
}

/**
 * Fully decrypted record
 * All sensitive fields are plaintext strings
 */
export interface BusinessLegalInfoDecrypted
  extends Omit<
    BusinessLegalInfoEncrypted,
    | 'tax_id_encrypted'
    | 'primary_bank_routing_encrypted'
    | 'primary_bank_account_encrypted'
    | 'secondary_bank_routing_encrypted'
    | 'secondary_bank_account_encrypted'
    | 'principal_owner_name_encrypted'
    | 'principal_owner_ssn_encrypted'
    | 'principal_phone_encrypted'
    | 'principal_email_encrypted'
  > {
  tax_id?: string; // Decrypted EIN/SSN/TIN
  primary_bank_routing?: string; // Decrypted routing number
  primary_bank_account?: string; // Decrypted account number
  secondary_bank_routing?: string; // Decrypted routing number
  secondary_bank_account?: string; // Decrypted account number
  principal_owner_name?: string; // Decrypted owner name
  principal_owner_ssn?: string; // Decrypted SSN
  principal_phone?: string; // Decrypted phone
  principal_email?: string; // Decrypted email
}

/**
 * Masked record for display
 * Sensitive fields are masked with last-four
 */
export interface BusinessLegalInfoMasked
  extends Omit<
    BusinessLegalInfoEncrypted,
    | 'tax_id_encrypted'
    | 'primary_bank_routing_encrypted'
    | 'primary_bank_account_encrypted'
    | 'secondary_bank_routing_encrypted'
    | 'secondary_bank_account_encrypted'
    | 'principal_owner_name_encrypted'
    | 'principal_owner_ssn_encrypted'
    | 'principal_phone_encrypted'
    | 'principal_email_encrypted'
  > {
  tax_id_masked?: string; // "12-345-67**" format
  primary_bank_account_masked?: string; // "****3210" format
  secondary_bank_account_masked?: string;
  principal_owner_name_masked?: string; // "John D***" format
  principal_owner_ssn_masked?: string; // "***-**-6789" format
  principal_phone_masked?: string; // "(***) ***-3456" format
  principal_email_masked?: string; // "j***@example.com" format
}

/**
 * Input type for creating a new business legal info record
 */
export interface BusinessLegalInfoCreateInput {
  entity_id: string;
  business_type: BusinessType;
  legal_business_name: string;
  dba_name?: string;
  tax_id_type?: TaxIdType;
  tax_id?: string; // Will be encrypted before storing
  formation_state?: string;
  formation_date?: string;
  business_license_number?: string;
  primary_bank_name?: string;
  primary_bank_routing?: string; // Will be encrypted
  primary_bank_account?: string; // Will be encrypted
  primary_bank_account_type?: BankAccountType;
  secondary_bank_name?: string;
  secondary_bank_routing?: string;
  secondary_bank_account?: string;
  principal_owner_name?: string; // Will be encrypted
  principal_owner_title?: string;
  principal_owner_ssn?: string; // Will be encrypted
  principal_owner_dob?: string;
  business_phone?: string;
  business_email?: string;
  principal_phone?: string; // Will be encrypted
  principal_email?: string; // Will be encrypted
  is_registered_with_state?: boolean;
  state_registration_id?: string;
  annual_filing_status?: AnnualFilingStatus;
  last_annual_filing_date?: string;
  has_business_insurance?: boolean;
  business_insurance_carrier?: string;
  business_insurance_policy_number?: string;
  business_insurance_expiration_date?: string;
  legal_notes?: string;
  compliance_notes?: string;
}

/**
 * Input type for updating an existing record
 */
export type BusinessLegalInfoUpdateInput = Partial<
  Omit<BusinessLegalInfoCreateInput, 'entity_id'>
>;

/**
 * Audit log entry
 */
export interface BusinessLegalInfoAuditLog {
  id: string;
  business_legal_info_id: string;
  user_id?: string;
  action: AuditLogAction;
  field_accessed?: string[]; // Array of field names that were accessed
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO timestamp
}

/**
 * Helper type for encryption/decryption results
 */
export interface EncryptionResult {
  success: boolean;
  error?: string;
  data?: string; // BYTEA as hex string
}

/**
 * Helper type for decryption results
 */
export interface DecryptionResult {
  success: boolean;
  error?: string;
  data?: string; // Plaintext
}

/**
 * Helper function types
 */
export type EncryptFunction = (plaintext: string) => Promise<string>;
export type DecryptFunction = (ciphertext: string) => Promise<string>;

/**
 * Service interface for business legal info operations
 */
export interface IBusinessLegalInfoService {
  create(input: BusinessLegalInfoCreateInput): Promise<BusinessLegalInfoDecrypted>;
  getById(id: string, decrypt?: boolean): Promise<BusinessLegalInfoEncrypted | BusinessLegalInfoDecrypted>;
  getByEntityId(
    entityId: string,
    decrypt?: boolean
  ): Promise<BusinessLegalInfoEncrypted | BusinessLegalInfoDecrypted | null>;
  getMasked(id: string): Promise<BusinessLegalInfoMasked | null>;
  update(id: string, input: BusinessLegalInfoUpdateInput): Promise<BusinessLegalInfoDecrypted>;
  delete(id: string): Promise<boolean>;
  list(filters?: { businessType?: BusinessType; state?: string }): Promise<BusinessLegalInfoEncrypted[]>;
  verify(id: string, verifiedBy: string): Promise<void>;
  logAccess(
    businessLegalInfoId: string,
    action: AuditLogAction,
    fieldsAccessed?: string[]
  ): Promise<void>;
}

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Service result type
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: ValidationError[];
}
