import { supabaseAdmin } from '@/lib/supabase';
import { getSignedURLForGCSFile } from '@/lib/google-cloud-storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get a signed URL for downloading a document
 * GET /api/documents/signed-url?document_id=...&expires_hours=1
 *
 * Query params:
 * - document_id: Document ID (required)
 * - expires_hours: How long the URL is valid (default 1, max 24)
 */
export async function GET(req: NextRequest) {
  try {
    const documentId = req.nextUrl.searchParams.get('document_id');
    const expiresHours = Math.min(
      24,
      Math.max(1, parseInt(req.nextUrl.searchParams.get('expires_hours') || '1'))
    );

    if (!documentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: document_id' },
        { status: 400 }
      );
    }

    // Get document from database
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Generate signed URL
    const signedUrl = await getSignedURLForGCSFile(document.gcs_path, expiresHours);

    return NextResponse.json({
      document_id: document.id,
      file_name: document.file_name,
      signed_url: signedUrl,
      expires_hours: expiresHours,
      expires_at: new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate signed URL',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
