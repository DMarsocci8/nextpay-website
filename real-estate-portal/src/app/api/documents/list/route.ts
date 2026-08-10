import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * List all documents with optional grouping
 * GET /api/documents/list?entity_id=...&group_by=type|year|property
 *
 * Query params:
 * - entity_id: Entity ID (required)
 * - group_by: Group results by 'type', 'year', or 'property' (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const entityId = req.nextUrl.searchParams.get('entity_id');
    const groupBy = req.nextUrl.searchParams.get('group_by') as
      | 'type'
      | 'year'
      | 'property'
      | null;

    if (!entityId) {
      return NextResponse.json(
        { error: 'Missing required parameter: entity_id' },
        { status: 400 }
      );
    }

    // Fetch all documents for the entity
    const { data: documents, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('List error:', error);
      return NextResponse.json(
        { error: 'Failed to list documents' },
        { status: 500 }
      );
    }

    if (!groupBy) {
      return NextResponse.json({
        documents: documents || [],
        total: documents?.length || 0,
      });
    }

    // Group documents
    let grouped: Record<string, any> = {};

    if (groupBy === 'type') {
      // Group by document_type
      (documents || []).forEach((doc) => {
        const type = doc.document_type || 'other';
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(doc);
      });
    } else if (groupBy === 'year') {
      // Group by year from document_date
      (documents || []).forEach((doc) => {
        const year = doc.document_date
          ? new Date(doc.document_date).getFullYear().toString()
          : 'undated';
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push(doc);
      });
    } else if (groupBy === 'property') {
      // Group by property_id
      (documents || []).forEach((doc) => {
        const propId = doc.property_id || 'entity-level';
        if (!grouped[propId]) {
          grouped[propId] = [];
        }
        grouped[propId].push(doc);
      });
    }

    return NextResponse.json({
      grouped,
      total: documents?.length || 0,
      group_by: groupBy,
    });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json(
      {
        error: 'List failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
