import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

let authClient: JWT | null = null;

// Initialize Google Auth
export const initializeGoogleAuth = () => {
  if (authClient) return authClient;

  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;

  if (!keyPath) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_PATH not set');
  }

  authClient = new JWT({
    keyFile: keyPath,
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  return authClient;
};

// Get Sheets API instance
export const getSheetsApi = () => {
  const auth = initializeGoogleAuth();
  return google.sheets({ version: 'v4', auth });
};

// Fetch specific sheet data
export const fetchSheetData = async (sheetId: string, range: string) => {
  try {
    const sheets = getSheetsApi();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return {
      values: response.data.values || [],
      range: response.data.range,
    };
  } catch (error) {
    console.error(`Error fetching sheet data from ${sheetId}:`, error);
    throw error;
  }
};

// Get all sheet names (tabs)
export const getSheetTabs = async (sheetId: string) => {
  try {
    const sheets = getSheetsApi();
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    return (
      response.data.sheets?.map((sheet) => ({
        id: sheet.properties?.sheetId,
        name: sheet.properties?.title,
        index: sheet.properties?.index,
      })) || []
    );
  } catch (error) {
    console.error(`Error fetching sheet tabs from ${sheetId}:`, error);
    throw error;
  }
};

// Helper to convert sheet data (2D array) to array of objects
export const sheetDataToObjects = (headers: any[], rows: any[][]): Record<string, any>[] => {
  return rows.map((row) => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
    });
    return obj;
  });
};

// Fetch and parse property overview from sheet
export const fetchPropertyOverview = async (sheetId: string, tabName: string = 'Property Overview (Rent Loan Sheet)') => {
  try {
    const data = await fetchSheetData(sheetId, `'${tabName}'`);

    if (!data.values || data.values.length === 0) {
      return [];
    }

    const [headers, ...rows] = data.values;
    return sheetDataToObjects(headers, rows);
  } catch (error) {
    console.error('Error fetching property overview:', error);
    throw error;
  }
};

// Fetch rent collection data
export const fetchRentCollection = async (sheetId: string, tabName: string = 'Rent Collection') => {
  try {
    const data = await fetchSheetData(sheetId, `'${tabName}'`);

    if (!data.values || data.values.length === 0) {
      return [];
    }

    const [headers, ...rows] = data.values;
    return sheetDataToObjects(headers, rows);
  } catch (error) {
    console.error('Error fetching rent collection data:', error);
    throw error;
  }
};

// Fetch utilities data
export const fetchUtilities = async (sheetId: string, tabName: string = 'UTILITIES') => {
  try {
    const data = await fetchSheetData(sheetId, `'${tabName}'`);

    if (!data.values || data.values.length === 0) {
      return [];
    }

    const [headers, ...rows] = data.values;
    return sheetDataToObjects(headers, rows);
  } catch (error) {
    console.error('Error fetching utilities:', error);
    throw error;
  }
};

// Fetch financial records (PITI, expenses, etc.)
export const fetchFinancialRecords = async (sheetId: string, tabName: string) => {
  try {
    const data = await fetchSheetData(sheetId, `'${tabName}'`);

    if (!data.values || data.values.length === 0) {
      return [];
    }

    const [headers, ...rows] = data.values;
    return sheetDataToObjects(headers, rows);
  } catch (error) {
    console.error('Error fetching financial records:', error);
    throw error;
  }
};

// Append data to sheet (for syncing back from portal)
export const appendToSheet = async (sheetId: string, range: string, values: any[][]) => {
  try {
    const sheets = getSheetsApi();
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
};

// Update existing data in sheet
export const updateSheet = async (sheetId: string, range: string, values: any[][]) => {
  try {
    const sheets = getSheetsApi();
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating sheet:', error);
    throw error;
  }
};
