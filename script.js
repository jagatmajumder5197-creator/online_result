const SHEET_NAME = "MASTER_SHEET_RESULT";
const SPREADSHEET_ID = "1Ft_3T0Rri91vCSP-JYRW2OC1eN1-ssuvtykXdRN6Y1M";

function doGet() {
  const data = getAllStudents();
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllStudents() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) return { error: "Sheet not found" };

  const values = sheet.getDataRange().getValues();
  const headers = values[0]; // কলামের নামগুলো (CLASS, STUDENTS_NAME ইত্যাদি)
  const rows = values.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header.toString().trim()] = row[i];
    });
    return obj;
  });
}
