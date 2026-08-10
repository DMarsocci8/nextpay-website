import { supabaseAdmin } from '@/lib/supabase';
import { fetchPropertyOverview, fetchUtilities, getSheetTabs } from '@/lib/google-sheets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entityId, sheetId } = body;

    if (!entityId || !sheetId) {
      return NextResponse.json(
        { error: 'entityId and sheetId are required' },
        { status: 400 }
      );
    }

    // Log sync start
    const { data: syncLog } = await supabaseAdmin
      .from('sync_logs')
      .insert([
        {
          entity_id: entityId,
          sync_type: 'full',
          status: 'started',
        },
      ])
      .select()
      .single();

    let recordsSynced = 0;
    let error = null;

    try {
      // Get all sheet tabs
      const tabs = await getSheetTabs(sheetId);
      console.log(`Found ${tabs.length} tabs in sheet`);

      // Sync property overview
      const properties = await fetchPropertyOverview(sheetId);
      console.log(`Synced ${properties.length} properties`);
      recordsSynced += properties.length;

      // Sync utilities
      const utilities = await fetchUtilities(sheetId);
      console.log(`Synced ${utilities.length} utility records`);
      recordsSynced += utilities.length;

      // Update sync log to completed
      if (syncLog) {
        await supabaseAdmin
          .from('sync_logs')
          .update({
            status: 'completed',
            records_synced: recordsSynced,
            synced_at: new Date().toISOString(),
          })
          .eq('id', syncLog.id);
      }
    } catch (syncError) {
      error = syncError instanceof Error ? syncError.message : 'Unknown error';

      // Update sync log to failed
      if (syncLog) {
        await supabaseAdmin
          .from('sync_logs')
          .update({
            status: 'failed',
            error_message: error,
          })
          .eq('id', syncLog.id);
      }
    }

    if (error) {
      return NextResponse.json(
        { error: `Sync failed: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recordsSynced,
      message: `Successfully synced ${recordsSynced} records`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync Google Sheets' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const entityId = req.nextUrl.searchParams.get('entity_id');

    if (!entityId) {
      return NextResponse.json(
        { error: 'entity_id is required' },
        { status: 400 }
      );
    }

    // Get recent sync logs
    const { data, error } = await supabaseAdmin
      .from('sync_logs')
      .select('*')
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sync logs' },
      { status: 500 }
    );
  }
}
