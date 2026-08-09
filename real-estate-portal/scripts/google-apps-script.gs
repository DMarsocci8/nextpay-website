/**
 * Real Estate Portal - Google Apps Script
 * Bi-directional sync between Google Sheets and Supabase
 *
 * IMPORTANT: This script must be deployed as a web app and webhook endpoint
 * Deploy to: Google Cloud Project real-estate-hub-504623
 * Service Account: real-estate-hub-app@real-estate-hub-504623.iam.gserviceaccount.com
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = 'https://bgqdwaoyaayeeweqdtxlw.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncWR3YW92YXlhZWV3cWR0eGl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA5NzgxOCwiZXhwIjoyMTAxNjczODE4fQ._Xy4JueSg_ITTnMT7hLFF3_QMbqo9hI9lNfGF_0NumU';

// Entity-to-Sheet mapping
const ENTITY_SHEETS = {
  'doma_capital': '1U_6BeT9JxCFsRNO8JD8PgKMOPhySLj7QKzbpi40XWzw',
  'domillo_holdings': '10u-KbmV9o8ku2c3ggfRQC43EhnA6yYPtSgSFfwJJPbo',
  'jagg': '1jUA0obH878JyYlYJi1fv5vLlfXWuNTOpo5grDyI6tqE'
};

const SHEET_TABS = {
  'properties': 'Properties',
  'tenants': 'Tenants',
  'rent_roll': 'Rent Roll',
  'maintenance': 'Maintenance',
  'utilities': 'Utilities',
  'mortgage': 'Mortgage',
  'insurance': 'Insurance'
};

// ============================================================================
// MAIN SYNC FUNCTIONS
// ============================================================================

/**
 * Main sync function - pull data from Google Sheets to Supabase
 */
function syncSheetsToSupabase() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  const entityKey = Object.keys(ENTITY_SHEETS).find(
    (key) => ENTITY_SHEETS[key] === spreadsheetId
  );

  if (!entityKey) {
    Logger.log('Error: Spreadsheet not found in entity mapping');
    return;
  }

  Logger.log(`Starting sync for entity: ${entityKey}`);

  const getEntityId = () => {
    const response = UrlFetchApp.fetch(
      `${SUPABASE_URL}/rest/v1/entities?slug=eq.${entityKey}&select=id`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = JSON.parse(response.getContentText());
    return data[0]?.id;
  };

  const entityId = getEntityId();
  if (!entityId) {
    Logger.log('Error: Entity not found');
    return;
  }

  // Sync each table
  syncProperties(spreadsheetId, entityId);
  syncTenants(spreadsheetId, entityId);
  syncRentRoll(spreadsheetId, entityId);
  syncMaintenance(spreadsheetId, entityId);
  syncUtilities(spreadsheetId, entityId);

  Logger.log('Sync completed successfully');
}

/**
 * Sync properties from Google Sheets to Supabase
 */
function syncProperties(spreadsheetId, entityId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TABS.properties);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const properties = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows

    const property = {
      entity_id: entityId,
      address: row[0],
      city: row[1] || '',
      state: row[2] || '',
      zip_code: row[3] || '',
      property_type: row[4] || 'residential',
      bedrooms: row[5] ? parseInt(row[5]) : null,
      bathrooms: row[6] ? parseFloat(row[6]) : null,
      square_footage: row[7] ? parseFloat(row[7]) : null,
      purchase_price: row[8] ? parseFloat(row[8]) : null,
      purchase_date: row[9] || null,
      is_occupied: row[10] !== false,
      notes: row[11] || '',
    };

    properties.push(property);
  }

  // Upsert to Supabase
  if (properties.length > 0) {
    const response = UrlFetchApp.fetch(
      `${SUPABASE_URL}/rest/v1/properties?on_conflict=entity_id,address`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        payload: JSON.stringify(properties),
      }
    );

    Logger.log(`Properties synced: ${properties.length} records`);
  }
}

/**
 * Sync tenants from Google Sheets to Supabase
 */
function syncTenants(spreadsheetId, entityId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TABS.tenants);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const tenants = [];

  // First, get all property IDs for this entity
  const propertiesResponse = UrlFetchApp.fetch(
    `${SUPABASE_URL}/rest/v1/properties?entity_id=eq.${entityId}&select=id,address`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    }
  );
  const properties = JSON.parse(propertiesResponse.getContentText());

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows

    const propertyAddress = row[1]; // Property address in sheet
    const property = properties.find((p) => p.address === propertyAddress);

    if (!property) {
      Logger.log(`Warning: Property not found for tenant: ${row[0]}`);
      continue;
    }

    const tenant = {
      property_id: property.id,
      full_name: row[0],
      email: row[2] || '',
      phone: row[3] || '',
      lease_start_date: row[4] || null,
      lease_end_date: row[5] || null,
      monthly_rent: row[6] ? parseFloat(row[6]) : 0,
      deposit_amount: row[7] ? parseFloat(row[7]) : 0,
      notes: row[8] || '',
    };

    tenants.push(tenant);
  }

  if (tenants.length > 0) {
    UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/tenants`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(tenants),
    });

    Logger.log(`Tenants synced: ${tenants.length} records`);
  }
}

/**
 * Sync rent roll from Google Sheets to Supabase
 */
function syncRentRoll(spreadsheetId, entityId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TABS.rent_roll);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const payments = [];

  // Get tenants for mapping
  const tenantsResponse = UrlFetchApp.fetch(
    `${SUPABASE_URL}/rest/v1/tenants?select=id,full_name`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    }
  );
  const tenants = JSON.parse(tenantsResponse.getContentText());

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;

    const tenant = tenants.find((t) => t.full_name === row[0]);
    if (!tenant) continue;

    const payment = {
      tenant_id: tenant.id,
      payment_date: row[1] || null,
      amount_due: row[2] ? parseFloat(row[2]) : 0,
      amount_paid: row[3] ? parseFloat(row[3]) : 0,
      payment_method: row[4] || 'unknown',
      notes: row[5] || '',
    };

    payments.push(payment);
  }

  if (payments.length > 0) {
    UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/rent_payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payments),
    });

    Logger.log(`Rent payments synced: ${payments.length} records`);
  }
}

/**
 * Sync maintenance records from Google Sheets to Supabase
 */
function syncMaintenance(spreadsheetId, entityId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TABS.maintenance);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const maintenance = [];

  const propertiesResponse = UrlFetchApp.fetch(
    `${SUPABASE_URL}/rest/v1/properties?entity_id=eq.${entityId}&select=id,address`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    }
  );
  const properties = JSON.parse(propertiesResponse.getContentText());

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;

    const property = properties.find((p) => p.address === row[0]);
    if (!property) continue;

    const record = {
      property_id: property.id,
      description: row[1],
      category: row[2] || 'other',
      requested_date: row[3] || null,
      completed_date: row[4] || null,
      estimated_cost: row[5] ? parseFloat(row[5]) : 0,
      actual_cost: row[6] ? parseFloat(row[6]) : 0,
      priority: row[7] || 'normal',
      status: row[8] || 'pending',
      notes: row[9] || '',
    };

    maintenance.push(record);
  }

  if (maintenance.length > 0) {
    UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/maintenance_records`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(maintenance),
    });

    Logger.log(`Maintenance records synced: ${maintenance.length} records`);
  }
}

/**
 * Sync utilities from Google Sheets to Supabase
 */
function syncUtilities(spreadsheetId, entityId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_TABS.utilities);
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const utilities = [];

  const propertiesResponse = UrlFetchApp.fetch(
    `${SUPABASE_URL}/rest/v1/properties?entity_id=eq.${entityId}&select=id,address`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      },
    }
  );
  const properties = JSON.parse(propertiesResponse.getContentText());

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;

    const property = properties.find((p) => p.address === row[0]);
    if (!property) continue;

    const utility = {
      property_id: property.id,
      utility_type: row[1] || 'other',
      provider_name: row[2],
      account_number: row[3] || '',
      average_monthly_cost: row[4] ? parseFloat(row[4]) : 0,
      notes: row[5] || '',
    };

    utilities.push(utility);
  }

  if (utilities.length > 0) {
    UrlFetchApp.fetch(
      `${SUPABASE_URL}/rest/v1/utilities?on_conflict=property_id,utility_type,provider_name`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates',
        },
        payload: JSON.stringify(utilities),
      }
    );

    Logger.log(`Utilities synced: ${utilities.length} records`);
  }
}

/**
 * Web app handler for receiving webhooks from Supabase
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    Logger.log('Webhook received:', payload);

    // Validate webhook signature if needed
    // TODO: Add webhook signature validation

    // Handle the sync based on table and operation
    if (payload.table === 'properties') {
      handlePropertyChange(payload);
    } else if (payload.table === 'tenants') {
      handleTenantChange(payload);
    } else if (payload.table === 'rent_payments') {
      handleRentPaymentChange(payload);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    Logger.log('Error processing webhook:', error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setResponseCode(400);
  }
}

/**
 * Handle property changes from Supabase → Google Sheets
 */
function handlePropertyChange(payload) {
  Logger.log('Handling property change...');
  // Implementation for syncing properties back to Sheets
}

/**
 * Handle tenant changes from Supabase → Google Sheets
 */
function handleTenantChange(payload) {
  Logger.log('Handling tenant change...');
  // Implementation for syncing tenants back to Sheets
}

/**
 * Handle rent payment changes from Supabase → Google Sheets
 */
function handleRentPaymentChange(payload) {
  Logger.log('Handling rent payment change...');
  // Implementation for syncing rent payments back to Sheets
}

// ============================================================================
// SETUP FUNCTIONS
// ============================================================================

/**
 * Initialize the script - call this once to set up triggers
 */
function initializeScript() {
  // Create trigger to sync every 6 hours
  ScriptApp.newTrigger('syncSheetsToSupabase')
    .timeBased()
    .everyHours(6)
    .create();

  Logger.log('Script initialized with hourly sync trigger');
}

/**
 * Remove all triggers
 */
function removeAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log('All triggers removed');
}

/**
 * Manual sync trigger
 */
function manualSync() {
  syncSheetsToSupabase();
}
