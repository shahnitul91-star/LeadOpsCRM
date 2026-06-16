const { google } = require('googleapis');
const Lead = require('../models/Lead');
const Department = require('../models/Department');

class GoogleSheetsSync {
  constructor() {
    this.sheets = google.sheets('v4');
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }

  async syncLeadsFromSheet(spreadsheetId, departmentId) {
    try {
      const authClient = await this.auth.getClient();
      const range = 'Sheet1!A2:Z';

      const response = await this.sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log('No data found in sheet');
        return { success: true, imported: 0 };
      }

      const department = await Department.findById(departmentId);
      let imported = 0;

      for (const row of rows) {
        const leadData = {
          leadId: row[0],
          firstName: row[1],
          lastName: row[2],
          email: row[3],
          mobileNumber: row[4],
          department: departmentId,
          disposition: 'New',
          status: 'Open',
          syncedFromSheet: true,
          sheetRowId: row[0],
        };

        const existingLead = await Lead.findOne({ leadId: row[0] });
        if (!existingLead) {
          await Lead.create(leadData);
          imported++;
        }
      }

      console.log(`Imported ${imported} leads from sheet`);
      return { success: true, imported };
    } catch (error) {
      console.error('Error syncing leads:', error);
      return { success: false, error: error.message };
    }
  }

  async setupAutoSync(spreadsheetId, departmentId, intervalMinutes = 60) {
    setInterval(async () => {
      console.log(`Auto-syncing leads from sheet ${spreadsheetId}`);
      await this.syncLeadsFromSheet(spreadsheetId, departmentId);
    }, intervalMinutes * 60 * 1000);
  }
}

module.exports = new GoogleSheetsSync();
