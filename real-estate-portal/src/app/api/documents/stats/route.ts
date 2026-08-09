import { supabaseAdmin } from '@/lib/supabase';
import { getEntityStorageUsage } from '@/lib/google-cloud-storage';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get document statistics for an entity
 * GET /api/documents/stats?entity_id=...
 *
 * Returns:
 * - Total documents count
 * - Documents grouped by type
 * - Documents grouped by year
 * - Storage usage from GCS
 * - Recent uploads
 */
export async function GET(req: NextRequest) {
  try {
    const entityId = req.nextUrl.searchParams.get('entity_id');
    const entitySlug = req.nextUrl.searchParams.get('entity_slug');

    if (!entityId) {
      return NextResponse.json(
        { error: 'Missing required parameter: entity_id' },
        { status: 400 }
      );
    }

    // Get entity slug if not provided
    let slug = entitySlug;
    if (!slug) {
      const { data: entity } = await supabaseAdmin
        .from('entities')
        .select('slug')
        .eq('id', entityId)
        .single();
      slug = entity?.slug;
    }

    // Get all documents for the entity
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Stats error:', error);
      return NextResponse.json(
        { error: 'Failed to get statistics' },
        { status: 500 }
      );
    }

    const docs = documents || [];

    // Count by type
    const typeStats: Record<string, number> = {};
    docs.forEach((doc) => {
      const type = doc.document_type || 'other';
      typeStats[type] = (typeStats[type] || 0) + 1;
    });

    // Count by year
    const yearStats: Record<string, number> = {};
    docs.forEach((doc) => {
      const year = doc.document_date
        ? new Date(doc.document_date).getFullYear().toString()
        : 'undated';
      yearStats[year] = (yearStats[year] || 0) + 1;
    });

    // Count by property
    const propertyStats: Record<string, number> = {};
    docs.forEach((doc) => {
      const propId = doc.property_id || 'entity-level';
      propertyStats[propId] = (propertyStats[propId] || 0) + 1;
    });

    // Get storage usage from GCS (if slug available)
    let storageUsage = null;
    if (slug) {
      try {
        storageUsage = await getEntityStorageUsage(slug);
      } catch (storageError) {
        console.error('Storage usage error:', storageError);
      }
    }

    // Get recent documents (last 5)
    const recentDocs = docs.slice(0, 5).map((doc) => ({
      id: doc.id,
      file_name: doc.file_name,
      document_type: doc.document_type,
      created_at: doc.created_at,
      file_size: doc.file_size,
    }));

    // Calculate total size
    const totalSize = docs.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

    return NextResponse.json({
      entity_id: entityId,
      total_documents: docs.length,
      total_size_bytes: totalSize,
      total_size_mb: (totalSize / (1024 * 1024)).toFixed(2),
      type_stats: typeStats,
      year_stats: yearStats,
      property_stats: propertyStats,
      storage_usage: storageUsage,
      recent_documents: recentDocs,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      {
        error: 'Stats calculation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
