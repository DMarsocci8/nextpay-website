import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const ENTITIES = {
  doma_capital: {
    name: 'Doma Capital',
    accent: '#1E40AF',
    slug: 'doma_capital',
  },
  domillo_holdings: {
    name: 'Domillo Holdings',
    accent: '#059669',
    slug: 'domillo_holdings',
  },
  jagg: {
    name: 'Jones & Green Group',
    accent: '#D97706',
    slug: 'jagg',
  },
};

export const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Mixed-Use',
  'Multi-Family',
  'Single-Family',
  'Townhouse',
  'Condo',
  'Land',
  'Other',
];

export const LOAN_TYPES = [
  'Conventional',
  'Commercial',
  'Hard Money',
  'Bridge Loan',
  'Construction',
  'SBA',
  'Portfolio',
  'Other',
];

export const UTILITY_TYPES = [
  'Electric',
  'Water',
  'Gas',
  'Sewer',
  'Trash',
  'Internet',
  'Telephone',
  'Cable',
  'HOA',
  'Other',
];

export const DOCUMENT_TYPES = [
  'Mortgage Document',
  'Lease',
  'Insurance Policy',
  'Utility Bill',
  'Renovation Permit',
  'Appraisal',
  'Tax Document',
  'Property Survey',
  'Title Deed',
  'Inspection Report',
  'Closing Statement',
  'Other',
];

export const RENOVATION_CATEGORIES = [
  'Kitchen',
  'Bathroom',
  'Flooring',
  'Roof',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Windows & Doors',
  'Siding & Exterior',
  'Painting',
  'Landscaping',
  'Interior Design',
  'Other',
];

export const FINANCIAL_RECORD_TYPES = [
  { value: 'piti_payment', label: 'PITI Payment' },
  { value: 'utility_expense', label: 'Utility Expense' },
  { value: 'repair', label: 'Repair' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'property_tax', label: 'Property Tax' },
  { value: 'income', label: 'Rental Income' },
  { value: 'expense', label: 'Other Expense' },
  { value: 'other', label: 'Other' },
];

// Format currency
export const formatCurrency = (value: number | null | undefined, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number | null | undefined, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

// Format date
export const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

// Format date and time
export const formatDateTime = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

// Format file size
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Generate slug from text
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Validate email
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone: string) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Calculate mortgage interest paid per month
export const calculateMonthlyInterest = (balance: number, interestRate: number) => {
  return (balance * interestRate) / 12 / 100;
};

// Calculate equity
export const calculateEquity = (currentValue: number, loanBalance: number) => {
  return currentValue - loanBalance;
};

// Calculate equity percentage
export const calculateEquityPercentage = (currentValue: number, loanBalance: number) => {
  if (currentValue === 0) return 0;
  return (calculateEquity(currentValue, loanBalance) / currentValue) * 100;
};
