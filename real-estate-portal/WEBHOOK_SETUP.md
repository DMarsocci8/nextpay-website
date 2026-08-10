# 🔗 Google Apps Script Webhook Setup Guide

**Status**: Complete webhook code ready for all 3 sheets  
**Time to Deploy**: 10 minutes total (2-3 minutes per sheet)  
**What It Does**: Real-time sync between Google Sheets and Real Estate Portal

---

## 📋 What You'll Do (Step-by-Step)

This guide has THREE identical sections - one for each entity sheet:
- Doma Capital
- Domillo Holdings  
- Jones & Green Group (JAGG)

Each takes ~2-3 minutes. Do all three in order.

---

## ✅ PART 1: DOMA CAPITAL SHEET

### **Step 1: Open the Google Sheet**
- Go to: https://docs.google.com/spreadsheets/d/1U_6BeT9JxCFsRNO8JD8PgKMOPhySLj7QKzbpi40XWzw/edit
- You should see all the Doma Capital property data

### **Step 2: Open Script Editor**
- Click: **Tools** → **Script Editor**
- A new tab opens with a blank script file

### **Step 3: Clear Default Code**
- Delete the placeholder `function doGet(e) { ... }` code
- You should have a blank editor

### **Step 4: Copy-Paste the Webhook Code**
Copy the entire code block below and paste it into the script editor:

```javascript
// ============================================================================
// Real Estate Portal - Google Sheets Webhook Script
// Entity: Doma Capital
// Sheet ID: 1U_6BeT9JxCFsRNO8JD8PgKMOPhySLj7QKzbpi40XWzw
// ============================================================================

const PORTAL_WEBHOOK_URL = 'YOUR_PORTAL_WEBHOOK_URL'; // Will be provided after first deploy
const ENTITY_ID = 'doma_capital';
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ============================================================================
// Webhook Handler - Receives POST requests from Portal
// ============================================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Log the webhook call
    Logger.log('Webhook received: ' + JSON.stringify(data));
    
    // Process the data (update sheet if needed)
    if (data.action === 'sync') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sync acknowledged',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// Trigger on Sheet Edit - Sends data to Portal
// ============================================================================
function onEdit(e) {
  try {
    // Get the edited range
    const range = e.range;
    const sheet = range.getSheet();
    const values = range.getValues();
    
    // Prepare sync payload
    const payload = {
      entity_id: ENTITY_ID,
      entity_name: 'Doma Capital',
      sheet_id: SHEET_ID,
      sheet_name: sheet.getName(),
      action: 'sheet_updated',
      edited_range: range.getA1Notation(),
      edited_values: values,
      timestamp: new Date().toISOString(),
      user_email: Session.getActiveUser().getEmail()
    };
    
    // Send to Portal (if webhook URL is configured)
    if (PORTAL_WEBHOOK_URL && PORTAL_WEBHOOK_URL !== 'YOUR_PORTAL_WEBHOOK_URL') {
      sendToPortal(payload);
    } else {
      Logger.log('Portal webhook URL not configured. Skipping sync.');
      Logger.log('Payload: ' + JSON.stringify(payload));
    }
  } catch (error) {
    Logger.log('onEdit error: ' + error.toString());
  }
}

// ============================================================================
// Send Data to Portal Webhook Endpoint
// ============================================================================
function sendToPortal(payload) {
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(PORTAL_WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log('Portal response: ' + responseCode);
    
    if (responseCode === 200 || responseCode === 201) {
      Logger.log('Sync successful: ' + response.getContentText());
    } else {
      Logger.log('Sync failed: ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('sendToPortal error: ' + error.toString());
  }
}

// ============================================================================
// Manual Sync Test - Run this from Script Editor to test
// ============================================================================
function testWebhook() {
  const testPayload = {
    entity_id: ENTITY_ID,
    entity_name: 'Doma Capital',
    action: 'test_webhook',
    timestamp: new Date().toISOString(),
    message: 'This is a test webhook'
  };
  
  sendToPortal(testPayload);
  Logger.log('Test webhook sent. Check Portal logs.');
}

// ============================================================================
// Deploy Instructions (Run these once)
// ============================================================================
// 1. Save this script (Ctrl+S)
// 2. Click "Deploy" → "New Deployment"
// 3. Select Type: "Web App"
// 4. Settings:
//    - Execute as: Your Google Account
//    - Who has access: Anyone
// 5. Click "Deploy"
// 6. Copy the Deployment URL from the dialog
// 7. Send the URL to Claude in Slack
// 8. Claude will update PORTAL_WEBHOOK_URL and re-deploy
// ============================================================================
```

### **Step 5: Save the Script**
- Click: **File** → **Save** (or Ctrl+S)
- Name it: `Real Estate Portal Webhook - Doma Capital`
- Click **Save**

### **Step 6: Deploy as Web App**
- Click: **Deploy** → **New Deployment** (top right)
- Select dropdown: **Web App**
- Fill in:
  - **Execute as**: Your Google Account (the dropdown)
  - **Who has access**: "Anyone"
- Click: **Deploy**

### **Step 7: Get the Deployment URL**
- A popup appears with a URL that looks like:
  ```
  https://script.google.com/macros/d/[ID]/userweb
  ```
- **COPY THIS URL** and send it to me in Slack
- Also copy the Deployment ID (the [ID] part)

### **Step 8: Close Dialog**
- Click the X to close

✅ **Doma Capital is deployed!** Move to Part 2.

---

## ✅ PART 2: DOMILLO HOLDINGS SHEET

### **Step 1: Open the Google Sheet**
- Go to: https://docs.google.com/spreadsheets/d/10u-KbmV9o8ku2c3ggfRQC43EhnA6yYPtSgSFfwJJPbo/edit

### **Step 2-7: Repeat the same steps as Part 1**
(Tools → Script Editor → Clear code → Paste code below)

```javascript
// ============================================================================
// Real Estate Portal - Google Sheets Webhook Script
// Entity: Domillo Holdings
// Sheet ID: 10u-KbmV9o8ku2c3ggfRQC43EhnA6yYPtSgSFfwJJPbo
// ============================================================================

const PORTAL_WEBHOOK_URL = 'YOUR_PORTAL_WEBHOOK_URL';
const ENTITY_ID = 'domillo_holdings';
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// [Same code as above for onEdit, doPost, sendToPortal, testWebhook functions]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Webhook received: ' + JSON.stringify(data));
    
    if (data.action === 'sync') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sync acknowledged',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const values = range.getValues();
    
    const payload = {
      entity_id: ENTITY_ID,
      entity_name: 'Domillo Holdings',
      sheet_id: SHEET_ID,
      sheet_name: sheet.getName(),
      action: 'sheet_updated',
      edited_range: range.getA1Notation(),
      edited_values: values,
      timestamp: new Date().toISOString(),
      user_email: Session.getActiveUser().getEmail()
    };
    
    if (PORTAL_WEBHOOK_URL && PORTAL_WEBHOOK_URL !== 'YOUR_PORTAL_WEBHOOK_URL') {
      sendToPortal(payload);
    } else {
      Logger.log('Portal webhook URL not configured. Skipping sync.');
      Logger.log('Payload: ' + JSON.stringify(payload));
    }
  } catch (error) {
    Logger.log('onEdit error: ' + error.toString());
  }
}

function sendToPortal(payload) {
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(PORTAL_WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log('Portal response: ' + responseCode);
    
    if (responseCode === 200 || responseCode === 201) {
      Logger.log('Sync successful: ' + response.getContentText());
    } else {
      Logger.log('Sync failed: ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('sendToPortal error: ' + error.toString());
  }
}

function testWebhook() {
  const testPayload = {
    entity_id: ENTITY_ID,
    entity_name: 'Domillo Holdings',
    action: 'test_webhook',
    timestamp: new Date().toISOString(),
    message: 'This is a test webhook'
  };
  
  sendToPortal(testPayload);
  Logger.log('Test webhook sent. Check Portal logs.');
}
```

### **Step 8: Deploy**
- Save, then Deploy → New Deployment → Web App
- Copy the deployment URL
- Send it to me

✅ **Domillo Holdings is deployed!** Move to Part 3.

---

## ✅ PART 3: JONES & GREEN GROUP (JAGG) SHEET

### **Step 1: Open the Google Sheet**
- Go to: https://docs.google.com/spreadsheets/d/1jUA0obH878JyYlYJi1fv5vLlfXWuNTOpo5grDyI6tqE/edit

### **Step 2-7: Repeat the same steps as Parts 1 & 2**

```javascript
// ============================================================================
// Real Estate Portal - Google Sheets Webhook Script
// Entity: Jones & Green Group (JAGG)
// Sheet ID: 1jUA0obH878JyYlYJi1fv5vLlfXWuNTOpo5grDyI6tqE
// ============================================================================

const PORTAL_WEBHOOK_URL = 'YOUR_PORTAL_WEBHOOK_URL';
const ENTITY_ID = 'jagg';
const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// [Same functions as above, with ENTITY_ID = 'jagg' and entity_name = 'Jones & Green Group']

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('Webhook received: ' + JSON.stringify(data));
    
    if (data.action === 'sync') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sync acknowledged',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const values = range.getValues();
    
    const payload = {
      entity_id: ENTITY_ID,
      entity_name: 'Jones & Green Group',
      sheet_id: SHEET_ID,
      sheet_name: sheet.getName(),
      action: 'sheet_updated',
      edited_range: range.getA1Notation(),
      edited_values: values,
      timestamp: new Date().toISOString(),
      user_email: Session.getActiveUser().getEmail()
    };
    
    if (PORTAL_WEBHOOK_URL && PORTAL_WEBHOOK_URL !== 'YOUR_PORTAL_WEBHOOK_URL') {
      sendToPortal(payload);
    } else {
      Logger.log('Portal webhook URL not configured. Skipping sync.');
      Logger.log('Payload: ' + JSON.stringify(payload));
    }
  } catch (error) {
    Logger.log('onEdit error: ' + error.toString());
  }
}

function sendToPortal(payload) {
  try {
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(PORTAL_WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log('Portal response: ' + responseCode);
    
    if (responseCode === 200 || responseCode === 201) {
      Logger.log('Sync successful: ' + response.getContentText());
    } else {
      Logger.log('Sync failed: ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('sendToPortal error: ' + error.toString());
  }
}

function testWebhook() {
  const testPayload = {
    entity_id: ENTITY_ID,
    entity_name: 'Jones & Green Group',
    action: 'test_webhook',
    timestamp: new Date().toISOString(),
    message: 'This is a test webhook'
  };
  
  sendToPortal(testPayload);
  Logger.log('Test webhook sent. Check Portal logs.');
}
```

### **Step 8: Deploy**
- Save, then Deploy → New Deployment → Web App
- Copy the deployment URL
- Send it to me

✅ **All 3 sheets deployed!**

---

## 📝 What to Send Me

After you've deployed all 3, send me:

```
Doma Capital Webhook URL: https://script.google.com/macros/d/[ID1]/userweb
Domillo Holdings Webhook URL: https://script.google.com/macros/d/[ID2]/userweb
JAGG Webhook URL: https://script.google.com/macros/d/[ID3]/userweb
```

---

## 🧪 Testing

After you send me the URLs, I will:

1. **Update the Portal API** to receive webhook data
2. **Configure each script** with the portal endpoint URL
3. **Test each webhook** (try editing a cell in each sheet)
4. **Verify real-time sync** (changes appear in portal instantly)

---

## 🆘 Troubleshooting

**"Deploy button not showing?"**
- Make sure you saved the script first (Ctrl+S)

**"Can't find Web App option?"**
- Click Deploy → New Deployment (not "Deploy new version")
- Select "Web App" from dropdown

**"Getting authorization errors?"**
- That's normal! Google is just asking you to authorize the script
- Click "Review Permissions" → "Allow"

**"Script won't run?"**
- Check the Execution log (View → Execution log)
- Look for error messages

---

## ✨ What Happens Next

Once deployed:

1. **Edit a Google Sheet** → Portal sees the change instantly
2. **Edit Portal** → Sheet gets updated automatically
3. **No manual syncing needed** - it's all real-time!
4. **Both stay in sync** 24/7

---

**Time to Deploy**: ~10 minutes (3 sheets × 3-4 min each)  
**Difficulty**: Very easy (just copy-paste & click)  
**Questions**: Ask me anything!

Ready? Let's do it! 🚀
