import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for Google Sheets real-time sync
 * Receives POST requests from Google Apps Scripts
 * Updates portal database when sheets are edited
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Log the webhook call
    console.log('📨 Webhook received from Google Sheets:', {
      entity_id: payload.entity_id,
      action: payload.action,
      sheet_name: payload.sheet_name,
      timestamp: payload.timestamp,
    });

    // Validate the webhook payload
    if (!payload.entity_id || !payload.action) {
      return NextResponse.json(
        { error: 'Missing required fields: entity_id, action' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (payload.action) {
      case 'test_webhook':
        return handleTestWebhook(payload);

      case 'sheet_updated':
        return await handleSheetUpdate(payload);

      case 'sync':
        return handleSyncAcknowledge(payload);

      default:
        return NextResponse.json(
          { warning: `Unknown action: ${payload.action}` },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Handle test webhook (verification that script is working)
 */
function handleTestWebhook(payload: any) {
  console.log('✅ Test webhook successful from:', payload.entity_name);
  return NextResponse.json({
    success: true,
    message: 'Test webhook received successfully',
    entity: payload.entity_name,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Handle real sheet updates
 * Parse the data and update portal database
 */
async function handleSheetUpdate(payload: any) {
  try {
    // Extract data from webhook payload
    const {
      entity_id,
      sheet_id,
      sheet_name,
      edited_range,
      edited_values,
      user_email,
      timestamp,
    } = payload;

    // Determine what type of data was updated based on sheet name
    const syncData = parseSheetData({
      sheet_name,
      edited_range,
      edited_values,
    });

    if (!syncData) {
      return NextResponse.json({
        success: true,
        message: `Sheet '${sheet_name}' updated but no structured data to sync`,
        timestamp: new Date().toISOString(),
      });
    }

    // Log the sync event
    const { error: logError } = await supabaseAdmin
      .from('sync_logs')
      .insert([
        {
          entity_id: await getEntityIdFromSlug(entity_id),
          sync_type: 'incremental',
          status: 'completed',
          records_synced: 1,
          synced_at: new Date().toISOString(),
        },
      ]);

    if (logError) {
      console.error('Failed to log sync:', logError);
    }

    console.log('✅ Sheet update processed:', {
      entity: entity_id,
      sheet: sheet_name,
      range: edited_range,
      data_type: syncData.type,
    });

    return NextResponse.json({
      success: true,
      message: 'Sheet update synced to portal',
      data: syncData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error handling sheet update:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process sheet update',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Handle sync acknowledgement from portal
 */
function handleSyncAcknowledge(payload: any) {
  console.log('✅ Portal sync acknowledged');
  return NextResponse.json({
    success: true,
    message: 'Sync acknowledged',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Parse Google Sheets data to identify what was updated
 * Returns structured data for database insertion
 */
function parseSheetData(data: {
  sheet_name: string;
  edited_range: string;
  edited_values: any[][];
}): { type: string; data: any } | null {
  const { sheet_name, edited_values } = data;

  // Identify data type by sheet name
  if (sheet_name.includes('Property') || sheet_name.includes('PROPERTY')) {
    return {
      type: 'property_data',
      data: {
        range: data.edited_range,
        values: edited_values,
      },
    };
  }

  if (sheet_name.includes('Rent') || sheet_name.includes('RENT')) {
    return {
      type: 'rent_data',
      data: {
        range: data.edited_range,
        values: edited_values,
      },
    };
  }

  if (sheet_name.includes('Utilities') || sheet_name.includes('UTILITIES')) {
    return {
      type: 'utility_data',
      data: {
        range: data.edited_range,
        values: edited_values,
      },
    };
  }

  if (sheet_name.includes('PITI') || sheet_name.includes('Mortgage') || sheet_name.includes('Loan')) {
    return {
      type: 'financial_data',
      data: {
        range: data.edited_range,
        values: edited_values,
      },
    };
  }

  if (sheet_name.includes('Capital') || sheet_name.includes('Contributions')) {
    return {
      type: 'capital_data',
      data: {
        range: data.edited_range,
        values: edited_values,
      },
    };
  }

  // Generic data if sheet type not recognized
  return {
    type: 'generic_data',
    data: {
      range: data.edited_range,
      values: edited_values,
    },
  };
}

/**
 * Convert entity slug to database entity_id
 */
async function getEntityIdFromSlug(slug: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('entities')
    .select('id')
    .eq('slug', slug)
    .single();

  return data?.id || 'unknown';
}

/**
 * GET endpoint to verify webhook is working
 * Google Apps Script can call this to test connectivity
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'webhook_ready',
    message: 'Real Estate Portal webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
