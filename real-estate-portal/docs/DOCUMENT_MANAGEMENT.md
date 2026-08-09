# Document Management System

A comprehensive document management system with file upload to Google Cloud Storage (GCS), advanced search capabilities, and entity-level file organization.

## Features

### 1. File Upload to GCS
- Upload files up to 10MB
- Automatic organization by entity → type → year
- Metadata tracking (file name, size, type, date)
- Support for tags and descriptions

### 2. Search & Filtering
- Full-text search by file name and description
- Filter by document type (mortgage, lease, insurance, utility, renovation, appraisal, tax, other)
- Filter by year
- Filter by tags
- Filter by property (if property-level organization)
- Pagination support (up to 100 items per page)

### 3. Entity-Level Organization
- All documents organized by entity
- Optional property-level organization
- Smart folder structure in GCS
- Support for entity-wide and property-specific documents

### 4. Document Management
- Download documents with temporary signed URLs (1-24 hours)
- Delete documents (removes from GCS and database)
- Bulk operations support
- View document statistics and storage usage

### 5. UI Components
- Grid and list view modes
- Document type badges with color coding
- File type icons
- Responsive design
- Real-time statistics dashboard

## Architecture

### API Endpoints

#### Document Upload
```
POST /api/upload/document

FormData:
- file: File object
- entity_id: Entity ID
- document_type: Type of document
- property_id?: Property ID (optional)
- year?: Year for organization (optional)
- tags?: Array of tags (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "document": {
    "id": "uuid",
    "file_name": "filename",
    "gcs_path": "gs://bucket/path",
    "document_type": "tax"
  }
}
```

#### Search Documents
```
GET /api/documents/search?entity_id=...&type=...&tags=...&q=...&page=1&limit=20
```

**Query Parameters:**
- `entity_id` (required): Entity ID
- `type`: Document type filter
- `tags`: Comma-separated tags
- `q`: Search query
- `property_id`: Property ID filter
- `year`: Year filter
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...documents],
  "total": 42,
  "page": 1,
  "per_page": 20,
  "total_pages": 3
}
```

#### List Documents (Grouped)
```
GET /api/documents/list?entity_id=...&group_by=type|year|property
```

**Response:**
```json
{
  "grouped": {
    "tax": [...documents],
    "mortgage": [...documents]
  },
  "total": 42,
  "group_by": "type"
}
```

#### Get Signed Download URL
```
GET /api/documents/signed-url?document_id=...&expires_hours=1
```

**Response:**
```json
{
  "document_id": "uuid",
  "file_name": "filename",
  "signed_url": "https://storage.googleapis.com/...",
  "expires_hours": 1,
  "expires_at": "2024-08-09T15:00:00Z"
}
```

#### Delete Document
```
DELETE /api/documents/delete

Body:
{
  "document_id": "uuid"
}
```

#### Get Statistics
```
GET /api/documents/stats?entity_id=...&entity_slug=...
```

**Response:**
```json
{
  "entity_id": "uuid",
  "total_documents": 42,
  "total_size_bytes": 1073741824,
  "total_size_mb": "1024.00",
  "type_stats": {
    "tax": 15,
    "mortgage": 10,
    "lease": 8,
    "insurance": 9
  },
  "year_stats": {
    "2024": 20,
    "2023": 15,
    "2022": 7
  },
  "property_stats": {
    "prop_123": 25,
    "prop_456": 17,
    "entity-level": 0
  },
  "storage_usage": {
    "totalFiles": 42,
    "totalSizeGB": 1.05
  },
  "recent_documents": [...]
}
```

### Database Schema

#### documents table
```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES entities(id),
  property_id uuid REFERENCES properties(id),
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  gcs_path text NOT NULL,
  document_type text NOT NULL,
  document_date date,
  description text,
  tags text[],
  uploaded_by uuid REFERENCES users(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  CONSTRAINT valid_document_type CHECK (
    document_type IN ('mortgage', 'lease', 'insurance', 'utility', 'renovation', 'appraisal', 'tax', 'other')
  )
);

CREATE INDEX idx_documents_entity_id ON documents(entity_id);
CREATE INDEX idx_documents_property_id ON documents(property_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
```

### GCS Storage Structure

```
gs://real-estate-hub-documents/
├── doma_capital/
│   ├── documents/
│   │   ├── lease_agreement.pdf
│   │   ├── property_deed.pdf
│   │   └── insurance_policy.pdf
│   └── taxes/
│       ├── 2024/
│       │   ├── 1040.pdf
│       │   └── schedule_c.pdf
│       ├── 2023/
│       │   ├── 1040.pdf
│       │   └── schedule_c.pdf
│       └── 2022/
├── domillo_holdings/
└── jagg/
```

## React Components

### DocumentManager
Main component that orchestrates all document operations.

```tsx
import DocumentManager from '@/components/documents/DocumentManager';

<DocumentManager
  entityId="entity-uuid"
  entitySlug="entity-slug"
  propertyId="property-uuid" // optional
  title="My Documents"
/>
```

### DocumentUploader
File upload component with drag-and-drop support.

```tsx
import DocumentUploader from '@/components/documents/DocumentUploader';

<DocumentUploader
  entityId="entity-uuid"
  propertyId="property-uuid" // optional
  onUploadStart={() => console.log('Uploading...')}
  onUploadComplete={(doc) => console.log('Done', doc)}
  onUploadError={(error) => console.log('Error', error)}
/>
```

### DocumentGrid
Display documents in grid or list view.

```tsx
import DocumentGrid from '@/components/documents/DocumentGrid';

<DocumentGrid
  documents={documents}
  view="grid" // or "list"
  onDownload={(id) => downloadDocument(id)}
  onDelete={(id) => deleteDocument(id)}
  onSelect={(id) => selectDocument(id)}
  selectedIds={selectedSet}
/>
```

### DocumentSearch
Search and filter interface.

```tsx
import DocumentSearch from '@/components/documents/DocumentSearch';

<DocumentSearch
  onSearch={(filters) => {
    // filters: { query?, types?, tags?, year? }
  }}
  isLoading={false}
/>
```

### DocumentStats
Statistics and analytics dashboard.

```tsx
import DocumentStats from '@/components/documents/DocumentStats';

<DocumentStats
  entityId="entity-uuid"
  entitySlug="entity-slug" // optional
/>
```

## Utility Functions

### Document Utils (`@/lib/document-utils`)

#### formatFileSize(bytes: number): string
Format bytes to human-readable size.
```tsx
formatFileSize(1024) // "1 KB"
formatFileSize(1048576) // "1 MB"
```

#### formatDate(dateString: string | null): string
Format date for display.
```tsx
formatDate('2024-08-09') // "Aug 09, 2024"
```

#### getFileIcon(fileType: string): string
Get emoji icon for file type.
```tsx
getFileIcon('application/pdf') // "📄"
getFileIcon('image/png') // "🖼️"
```

#### sortDocuments(docs, sortBy, ascending): Document[]
Sort documents by date, name, size, or type.
```tsx
const sorted = sortDocuments(documents, 'date', false);
```

#### filterDocuments(docs, filters): Document[]
Apply multiple filters to documents.
```tsx
const filtered = filterDocuments(documents, {
  types: ['tax', 'mortgage'],
  tags: ['important'],
  searchQuery: 'quarterly',
  yearRange: [2023, 2024],
  propertyId: 'prop-123'
});
```

#### groupDocuments(docs, groupBy): Record<string, Document[]>
Group documents by type, year, property, or tag.
```tsx
const grouped = groupDocuments(documents, 'year');
// { '2024': [...], '2023': [...] }
```

#### validateFile(file, options): { valid, error? }
Validate file before upload.
```tsx
const result = validateFile(file, {
  maxSizeBytes: 10 * 1024 * 1024,
  allowedTypes: ['application/pdf'],
  allowedExtensions: ['pdf', 'doc']
});
```

## Usage Examples

### Basic Setup

```tsx
// pages/[entity]/documents/page.tsx
import DocumentManager from '@/components/documents/DocumentManager';

export default function DocumentsPage({ params }) {
  return (
    <DocumentManager
      entityId={entityId}
      entitySlug={entitySlug}
      title={`${entityName} - Documents`}
    />
  );
}
```

### Custom Document Upload Handler

```tsx
import { useState } from 'react';
import DocumentUploader from '@/components/documents/DocumentUploader';
import DocumentGrid from '@/components/documents/DocumentGrid';

export function CustomDocumentManager() {
  const [documents, setDocuments] = useState([]);

  const handleUploadComplete = (doc) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const handleDownload = async (docId) => {
    const response = await fetch(
      `/api/documents/signed-url?document_id=${docId}`
    );
    const { signed_url } = await response.json();
    window.open(signed_url);
  };

  return (
    <div className="space-y-6">
      <DocumentUploader
        entityId="entity-id"
        onUploadComplete={handleUploadComplete}
      />
      <DocumentGrid
        documents={documents}
        onDownload={handleDownload}
      />
    </div>
  );
}
```

### Search and Filter

```tsx
import { useState } from 'react';
import DocumentSearch from '@/components/documents/DocumentSearch';
import { filterDocuments } from '@/lib/document-utils';

export function SearchDocuments() {
  const [filteredDocs, setFilteredDocs] = useState([]);

  const handleSearch = (filters) => {
    const results = filterDocuments(allDocuments, {
      types: filters.types,
      tags: filters.tags,
      searchQuery: filters.query,
      yearRange: filters.year ? [parseInt(filters.year), parseInt(filters.year)] : undefined
    });
    setFilteredDocs(results);
  };

  return <DocumentSearch onSearch={handleSearch} />;
}
```

## Environment Variables

Required environment variables:

```env
# Google Cloud Storage
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=/path/to/service-account-key.json
GCS_BUCKET_NAME=real-estate-hub-documents

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security Considerations

1. **File Size Limits**: Default 10MB max, enforced server-side
2. **Signed URLs**: Temporary URLs with 1-24 hour expiration
3. **Entity-level Access**: Documents are scoped to entities
4. **File Type Validation**: Client and server-side validation
5. **Secure Deletion**: Files deleted from both GCS and database

## Performance Optimization

### Pagination
Documents are paginated (default 20, max 100 per page) to prevent large data transfers.

### Indexing
Database indexes on:
- `entity_id`
- `property_id`
- `document_type`
- `created_at`

### Caching
Consider implementing Redis caching for:
- Document stats
- Recent documents list
- Type/year/property groupings

### GCS Optimization
- Use signed URLs instead of direct file serving
- Enable GCS compression for large files
- Consider CDN for frequently accessed documents

## Troubleshooting

### Upload Fails
1. Check file size (max 10MB)
2. Verify entity_id exists
3. Check GCS service account permissions
4. Review server logs for GCS errors

### Search Returns No Results
1. Verify entity_id is correct
2. Check document_type values (case-sensitive)
3. Ensure documents exist in database

### Downloads Fail
1. Verify GCS bucket exists and is accessible
2. Check GCS service account has read permissions
3. Ensure signed URL hasn't expired

### Stats Not Loading
1. Check entity_slug is correct
2. Verify GCS service account permissions
3. Ensure documents table has data

## Future Enhancements

- [ ] OCR for document content search
- [ ] Document versioning
- [ ] Bulk import/export
- [ ] Share permissions
- [ ] Document templates
- [ ] Automated categorization
- [ ] Compliance audit logs
- [ ] Integration with document signing services
