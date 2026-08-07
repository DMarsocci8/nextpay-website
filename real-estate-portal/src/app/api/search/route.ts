import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q');
    const entityId = req.nextUrl.searchParams.get('entity_id');
    const searchType = req.nextUrl.searchParams.get('type') || 'all'; // all, properties, documents, financial

    if (!query || !entityId) {
      return NextResponse.json(
        { error: 'q (query) and entity_id are required' },
        { status: 400 }
      );
    }

    const results: any = {
      properties: [],
      documents: [],
      financial: [],
    };

    // Search properties
    if (searchType === 'all' || searchType === 'properties') {
      const { data } = await supabaseAdmin
        .from('properties')
        .select('id, address, city, state, zip_code, property_type')
        .eq('entity_id', entityId)
        .or(
          `address.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%,zip_code.ilike.%${query}%`
        )
        .limit(10);

      results.properties = data || [];
    }

    // Search documents
    if (searchType === 'all' || searchType === 'documents') {
      const { data } = await supabaseAdmin
        .from('documents')
        .select(
          'id, file_name, document_type, document_date, property_id'
        )
        .eq('entity_id', entityId)
        .or(
          `file_name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{"${query.toLowerCase()}"}`
        )
        .limit(10);

      results.documents = data || [];
    }

    // Search financial records
    if (searchType === 'all' || searchType === 'financial') {
      const { data } = await supabaseAdmin
        .from('financial_records')
        .select(
          'id, record_type, amount, transaction_date, description, property_id'
        )
        .eq('entity_id', entityId)
        .or(`description.ilike.%${query}%`)
        .limit(10);

      results.financial = data || [];
    }

    return NextResponse.json({
      query,
      results,
      total:
        results.properties.length +
        results.documents.length +
        results.financial.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
