import { supabaseAdmin } from '@/lib/supabase';
import { deleteFileFromGCS } from '@/lib/google-cloud-storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Delete a document from GCS and database
 * DELETE /api/documents/delete
 *
 * Request body:
 * - document_id: Document ID to delete
 */
export async function DELETE(req: NextRequest) {
  try {
    const { document_id } = await req.json();

    if (!document_id) {
      return NextResponse.json(
        { error: 'Missing required field: document_id' },
        { status: 400 }
      );
    }

    // Get document from database
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete from GCS
    try {
      await deleteFileFromGCS(document.gcs_path);
    } catch (gcsError) {
      console.error('GCS deletion failed:', gcsError);
      // Continue to delete DB record anyway
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('documents')
      .delete()
      .eq('id', document_id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete document record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      document_id,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      {
        error: 'Delete failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST for bulk delete (safer for some clients)
 */
export async function POST(req: NextRequest) {
  const method = req.headers.get('x-http-method-override');
  if (method === 'DELETE') {
    return DELETE(req);
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
