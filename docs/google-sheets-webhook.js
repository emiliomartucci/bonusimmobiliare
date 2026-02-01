/**
 * Google Apps Script - Dokicasa Click Tracking Webhook
 * v1.0.0 - 2026-02-01
 *
 * SETUP:
 * 1. Apri il Google Sheet: https://docs.google.com/spreadsheets/d/1mBXlAKZyO31o_JFga7w16j4rc9dVmLxdCSIE3_5Mjyg/
 * 2. Vai su Estensioni > Apps Script
 * 3. Incolla questo codice
 * 4. Clicca Deploy > New deployment
 * 5. Seleziona "Web app"
 * 6. Execute as: Me | Who has access: Anyone
 * 7. Copia l'URL del webhook e aggiungilo come env var GOOGLE_SHEETS_WEBHOOK
 */

// Sheet name where clicks will be logged
const SHEET_NAME = 'Clicks';

// Column headers (must match order in appendRow)
const HEADERS = [
  'Timestamp',
  'Session ID',
  'Landing Page',
  'CTA Location',
  'Referrer',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Term',
  'UTM Content',
  'Device Type',
  'Screen Width',
  'Screen Height',
  'Viewport Width',
  'Viewport Height',
  'Time on Page (s)',
  'Scroll Depth (%)',
  'Pages Before',
  'Clicks on Page',
  'Country',
  'City',
  'Region',
  'Timezone',
  'Language',
  'Platform',
  'Connection Type',
  'Page Load Time (ms)'
];

/**
 * Handle POST requests from Cloudflare Worker
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Create sheet with headers if it doesn't exist
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      newSheet.appendRow(HEADERS);
      newSheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      appendClickData(newSheet, data);
    } else {
      // Check if headers exist, add if not
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      }
      appendClickData(sheet, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error processing click:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Append click data as a new row
 */
function appendClickData(sheet, data) {
  const timeOnPageSeconds = data.time_on_page_ms ? Math.round(data.time_on_page_ms / 1000) : '';

  const row = [
    new Date().toISOString(),                    // Timestamp
    data.session_id || '',                       // Session ID
    data.landing_page || '',                     // Landing Page
    data.cta_location || '',                     // CTA Location
    data.referrer || '',                         // Referrer
    data.utm_source || '',                       // UTM Source
    data.utm_medium || '',                       // UTM Medium
    data.utm_campaign || '',                     // UTM Campaign
    data.utm_term || '',                         // UTM Term
    data.utm_content || '',                      // UTM Content
    data.device_type || '',                      // Device Type
    data.screen_width || '',                     // Screen Width
    data.screen_height || '',                    // Screen Height
    data.viewport_width || '',                   // Viewport Width
    data.viewport_height || '',                  // Viewport Height
    timeOnPageSeconds,                           // Time on Page (seconds)
    data.scroll_depth_percent || '',             // Scroll Depth (%)
    data.pages_before || '',                     // Pages Before (JSON string)
    data.clicks_on_page || '',                   // Clicks on Page
    data.ip_country || '',                       // Country
    data.ip_city || '',                          // City
    data.ip_region || '',                        // Region
    data.ip_timezone || '',                      // Timezone
    data.language || '',                         // Language
    data.platform || '',                         // Platform
    data.connection_type || '',                  // Connection Type
    data.page_load_time_ms || ''                 // Page Load Time (ms)
  ];

  sheet.appendRow(row);
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Dokicasa Click Tracking Webhook is active',
      version: '1.0.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function - run once to create sheet with headers
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Clear and add headers
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);

  // Set column widths
  sheet.setColumnWidth(1, 180);  // Timestamp
  sheet.setColumnWidth(2, 200);  // Session ID
  sheet.setColumnWidth(3, 250);  // Landing Page

  Logger.log('Sheet setup complete!');
}
