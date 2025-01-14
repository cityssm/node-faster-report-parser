import { dateToString, dateToTimeString } from '@cityssm/utils-datetime';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from '../../debug.config.js';
import { extractReportMetadata, getXLSXWorkBook, getXLSXWorkSheetData } from '../helpers.js';
const debug = Debug(`${DEBUG_NAMESPACE}:xlsx:w604`);
export const w604ReportName = 'W604 - Integration Log Viewer';
function isHeaderRow(row) {
    return row.length === 9 && row[0] === 'MESSAGE ID' && row[1] === 'TIMESTAMP';
}
function isMessageRow(row) {
    return row.length === 8 && row[0] !== '';
}
/**
 * Parses the XLSX version of the "W604 - Integration Log Viewer".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export function parseW604ExcelReport(pathToXlsxFile) {
    const workbook = getXLSXWorkBook(pathToXlsxFile);
    /*
     * Validate workbook
     */
    const results = extractReportMetadata(workbook, {
        reportNameRowNumber: 2,
        exportDateTimeRowNumber: 3
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (results.reportName !== w604ReportName) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid reportName: ${results.reportName}`);
    }
    /*
     * Loop through sheets
     */
    debug(`Looping through ${workbook.SheetNames.length} sheets`);
    for (const sheetName of workbook.SheetNames) {
        // eslint-disable-next-line security/detect-object-injection
        const worksheetData = getXLSXWorkSheetData(workbook.Sheets[sheetName], true);
        /*
         * Loop through rows
         */
        let pastHeaderRow = false;
        for (const row of worksheetData) {
            if (pastHeaderRow && isMessageRow(row)) {
                const timestampDate = new Date(row[1] ?? '');
                results.data.push({
                    messageId: Number.parseInt(row[0] ?? ''),
                    timestampDate: dateToString(timestampDate),
                    timestampTime: dateToTimeString(timestampDate),
                    logLevel: row[2] ?? '',
                    message: row[5] ?? '',
                    transactionData: (row[7] ?? '').trim()
                });
            }
            else if (isHeaderRow(row)) {
                pastHeaderRow = true;
            }
            else {
                debug(row);
            }
        }
    }
    return results;
}
