import { Document, DocumentType } from '@/types';

/**
 * Document type labels for display
 */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  mortgage: 'Mortgage',
  lease: 'Lease',
  insurance: 'Insurance',
  utility: 'Utility',
  renovation: 'Renovation',
  appraisal: 'Appraisal',
  tax: 'Tax',
  other: 'Other',
};

/**
 * Document type colors for UI
 */
export const DOCUMENT_TYPE_COLORS: Record<DocumentType, string> = {
  mortgage: 'bg-blue-100 text-blue-800',
  lease: 'bg-green-100 text-green-800',
  insurance: 'bg-red-100 text-red-800',
  utility: 'bg-yellow-100 text-yellow-800',
  renovation: 'bg-purple-100 text-purple-800',
  appraisal: 'bg-indigo-100 text-indigo-800',
  tax: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
};

/**
 * Get icon class for file type
 */
export const getFileIcon = (fileType: string): string => {
  const type = fileType.toLowerCase();

  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('sheet') || type.includes('csv')) return '📊';
  if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
  if (type.includes('zip') || type.includes('compress')) return '📦';

  return '📋';
};

/**
 * Sort documents by different criteria
 */
export const sortDocuments = (
  documents: Document[],
  sortBy: 'date' | 'name' | 'size' | 'type' = 'date',
  ascending: boolean = false
): Document[] => {
  const sorted = [...documents];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        comparison = dateA - dateB;
        break;

      case 'name':
        comparison = a.file_name.localeCompare(b.file_name);
        break;

      case 'size':
        comparison = (a.file_size || 0) - (b.file_size || 0);
        break;

      case 'type':
        comparison = a.document_type.localeCompare(b.document_type);
        break;
    }

    return ascending ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Filter documents by multiple criteria
 */
export interface DocumentFilter {
  types?: DocumentType[];
  tags?: string[];
  searchQuery?: string;
  yearRange?: [number, number];
  propertyId?: string;
}

export const filterDocuments = (
  documents: Document[],
  filters: DocumentFilter
): Document[] => {
  return documents.filter((doc) => {
    // Filter by types
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(doc.document_type as DocumentType)) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      if (!doc.tags || !doc.tags.length) return false;
      const docTags = doc.tags.map((t) => t.toLowerCase());
      const hasAnyTag = filters.tags.some((tag) =>
        docTags.includes(tag.toLowerCase())
      );
      if (!hasAnyTag) return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesFileName = doc.file_name.toLowerCase().includes(query);
      const matchesDescription = doc.description?.toLowerCase().includes(query);
      if (!matchesFileName && !matchesDescription) return false;
    }

    // Filter by year range
    if (filters.yearRange && doc.document_date) {
      const year = new Date(doc.document_date).getFullYear();
      const [minYear, maxYear] = filters.yearRange;
      if (year < minYear || year > maxYear) return false;
    }

    // Filter by property
    if (filters.propertyId) {
      if (doc.property_id !== filters.propertyId) return false;
    }

    return true;
  });
};

/**
 * Group documents by criteria
 */
export type GroupBy = 'type' | 'year' | 'property' | 'tag';

export const groupDocuments = (
  documents: Document[],
  groupBy: GroupBy
): Record<string, Document[]> => {
  const grouped: Record<string, Document[]> = {};

  documents.forEach((doc) => {
    let key: string;

    switch (groupBy) {
      case 'type':
        key = DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType] || 'Other';
        break;

      case 'year':
        key = doc.document_date
          ? new Date(doc.document_date).getFullYear().toString()
          : 'Undated';
        break;

      case 'property':
        key = doc.property_id || 'Entity Level';
        break;

      case 'tag':
        if (!doc.tags || doc.tags.length === 0) {
          key = 'Untagged';
        } else {
          doc.tags.forEach((tag) => {
            if (!grouped[tag]) grouped[tag] = [];
            grouped[tag].push(doc);
          });
          return;
        }
        break;
    }

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(doc);
  });

  return grouped;
};

/**
 * Export documents metadata as CSV
 */
export const exportDocumentsAsCSV = (documents: Document[]): string => {
  const headers = [
    'File Name',
    'Document Type',
    'File Size (MB)',
    'Date',
    'Tags',
    'Description',
  ];

  const rows = documents.map((doc) => [
    doc.file_name,
    DOCUMENT_TYPE_LABELS[doc.document_type as DocumentType] || doc.document_type,
    (doc.file_size / (1024 * 1024)).toFixed(2),
    formatDate(doc.document_date),
    doc.tags?.join('; ') || '',
    doc.description || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csv;
};

/**
 * Validate file before upload
 */
export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export const validateFile = (
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } => {
  const {
    maxSizeBytes = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  // Check size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSizeBytes)} limit`,
    };
  }

  // Check type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check extension
  if (allowedExtensions.length > 0) {
    const ext = getFileExtension(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File extension .${ext} is not allowed`,
      };
    }
  }

  return { valid: true };
};
