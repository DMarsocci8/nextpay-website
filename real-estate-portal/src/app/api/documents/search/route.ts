import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { PaginatedResponse, Document } from '@/types';

/**
 * Search and filter documents
 * GET /api/documents/search?entity_id=...&type=...&tags=...&q=...&page=1&limit=20
 *
 * Query params:
 * - entity_id: Entity ID (required)
 * - type: Document type filter (mortgage, lease, insurance, etc.)
 * - tags: Comma-separated tags to filter by
 * - q: Search query for file names and descriptions
 * - property_id: Filter by property ID (optional)
 * - year: Filter by year (optional)
 * - page: Page number (default 1)
 * - limit: Items per page (default 20, max 100)
 */
export async function GET(req: NextRequest) {
  try {
    const entityId = req.nextUrl.searchParams.get('entity_id');
    const documentType = req.nextUrl.searchParams.get('type');
    const tagsParam = req.nextUrl.searchParams.get('tags');
    const searchQuery = req.nextUrl.searchParams.get('q');
    const propertyId = req.nextUrl.searchParams.get('property_id');
    const year = req.nextUrl.searchParams.get('year');
    const page = Math.max(1, parseInt(req.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(req.nextUrl.searchParams.get('limit') || '20'));

    // Validate required parameters
    if (!entityId) {
      return NextResponse.json(
        { error: 'Missing required parameter: entity_id' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabaseAdmin
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('entity_id', entityId);

    // Apply filters
    if (documentType) {
      query = query.eq('document_type', documentType);
    }

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    // Search by filename or description
    if (searchQuery) {
      query = query.or(
        `file_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    }

    // Filter by year in document_date
    if (year) {
      const yearStart = `${year}-01-01`;
      const yearEnd = `${year}-12-31`;
      query = query
        .gte('document_date', yearStart)
        .lte('document_date', yearEnd);
    }

    // Sort by created_at descending
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: documents, error, count } = await query;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to search documents' },
        { status: 500 }
      );
    }

    // Filter by tags if provided
    let filteredDocs = documents || [];
    if (tagsParam) {
      const requiredTags = tagsParam.split(',').map((t) => t.trim().toLowerCase());
      filteredDocs = filteredDocs.filter((doc) => {
        if (!doc.tags || doc.tags.length === 0) return false;
        const docTags = doc.tags.map((t) => t.toLowerCase());
        return requiredTags.some((tag) => docTags.includes(tag));
      });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    const response: PaginatedResponse<Document> = {
      data: filteredDocs as Document[],
      total: count || 0,
      page,
      per_page: limit,
      total_pages: totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        error: 'Search failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
