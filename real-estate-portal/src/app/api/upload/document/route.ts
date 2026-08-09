import { supabaseAdmin } from '@/lib/supabase';
import { uploadFileToGCS } from '@/lib/google-cloud-storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handle file uploads to Google Cloud Storage
 * POST /api/upload/document
 *
 * Request body: FormData with:
 * - file: File object
 * - entity_id: Entity ID
 * - document_type: Type of document (tax, lease, mortgage, etc.)
 * - property_id: (optional) Property ID
 * - year: (optional) Year for tax documents
 */
export async function POST(req: NextRequest) {
  try {
    // Get user ID from request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const entityId = formData.get('entity_id') as string;
    const documentType = formData.get('document_type') as string;
    const propertyId = formData.get('property_id') as string | null;
    const year = formData.get('year') as string | null;
    const tags = formData.getAll('tags') as string[];

    // Validate required fields
    if (!file || !entityId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, entity_id, document_type' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Get entity to find slug
    const { data: entityData, error: entityError } = await supabaseAdmin
      .from('entities')
      .select('slug')
      .eq('id', entityId)
      .single();

    if (entityError || !entityData) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to GCS with smart path organization
    let gcspath: string;
    try {
      // Organize by: /entity/type/year/filename (if year provided)
      const fileType =
        documentType === 'tax' ? 'taxes' : documentType === 'lease' ? 'leases' : 'documents';

      gcspath = await uploadFileToGCS(
        buffer,
        file.name,
        entityData.slug,
        fileType as any,
        year ? parseInt(year) : undefined
      );
    } catch (gcsError) {
      console.error('GCS upload failed:', gcsError);
      return NextResponse.json(
        {
          error: 'Failed to upload file to cloud storage',
          details: gcsError instanceof Error ? gcsError.message : String(gcsError),
        },
        { status: 500 }
      );
    }

    // Create document record in database
    const { data: docData, error: docError } = await supabaseAdmin
      .from('documents')
      .insert([
        {
          entity_id: entityId,
          property_id: propertyId || null,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          gcs_path: gcspath,
          document_type: documentType,
          document_date: new Date().toISOString().split('T')[0],
          tags: tags.length > 0 ? tags : null,
          description: `${documentType} - ${year || new Date().getFullYear()}`,
        },
      ])
      .select()
      .single();

    if (docError) {
      console.error('Database error:', docError);
      // Try to delete the file from GCS since DB insert failed
      try {
        // Note: In production, implement deleteFileFromGCS
        console.log(`Note: File uploaded to GCS but DB record failed: ${gcspath}`);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }

      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      );
    }

    console.log(`✅ Document uploaded successfully: ${docData.id}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Document uploaded successfully',
        document: {
          id: docData.id,
          file_name: docData.file_name,
          gcs_path: docData.gcs_path,
          document_type: docData.document_type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Download a document file
 * GET /api/upload/document?id=document_id
 */
export async function GET(req: NextRequest) {
  try {
    const documentId = req.nextUrl.searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    // Get document from database
    const { data: docData, error: docError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !docData) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // In production, use getSignedURLForGCSFile for temporary access
    // For now, return the GCS path
    return NextResponse.json({
      document: {
        id: docData.id,
        file_name: docData.file_name,
        gcs_path: docData.gcs_path,
        file_size: docData.file_size,
        file_type: docData.file_type,
        document_type: docData.document_type,
        document_date: docData.document_date,
        created_at: docData.created_at,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
