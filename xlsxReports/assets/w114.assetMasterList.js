import { dateToString } from '@cityssm/utils-datetime';
import Debug from 'debug';
import { extractReportMetadata, getXLSXWorkBook, getXLSXWorkSheetData } from '../helpers.js';
const debug = Debug('faster-report-parser:xlsx:w114');
export const w114ReportName = 'W114 - Asset Master List';
function isDataRow(row) {
    return row.length === 19 && Number.isFinite(Number.parseFloat(row[2] ?? ''));
}
/**
 * Parses the XLSX version of the "W114 - Asset Master List".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export function parseW114ExcelReport(pathToXlsxFile) {
    const workbook = getXLSXWorkBook(pathToXlsxFile);
    /*
     * Validate workbook
     */
    const results = extractReportMetadata(workbook, {
        reportNameRowNumber: 2,
        exportDateTimeRowNumber: 3
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (results.reportName !== w114ReportName) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid reportName: ${results.reportName}`);
    }
    /*
     * Loop through sheets
     */
    debug(`Looping through ${workbook.SheetNames.length} sheets`);
    for (const sheetName of workbook.SheetNames) {
        // eslint-disable-next-line security/detect-object-injection
        const worksheetData = getXLSXWorkSheetData(workbook.Sheets[sheetName]);
        for (const row of worksheetData) {
            if (!isDataRow(row)) {
                continue;
            }
            // debug('Data Row: ' + JSON.stringify(row))
            const meterReadings = [];
            const meterTypes = row[13] ?? '';
            const actualReadings = row[14] ?? '';
            const meterTypesSplit = meterTypes.split(',');
            const actualReadingsSplit = actualReadings.split(',');
            for (const [index, meterTypeUntrimmed] of meterTypesSplit.entries()) {
                const meterType = meterTypeUntrimmed.trim();
                if (meterType !== '' && meterType !== 'No Meters') {
                    meterReadings.push({
                        meterType,
                        // eslint-disable-next-line security/detect-object-injection
                        actualReading: Number.parseFloat(actualReadingsSplit[index].trim())
                    });
                }
            }
            const acquireDate = new Date(row[15] ?? '');
            const asset = {
                assetNumber: row[0]?.trim() ?? '',
                financialReferenceNumber: row[1] ?? '',
                year: Number.parseInt(row[2] ?? ''),
                make: row[4] ?? '',
                model: row[5] ?? '',
                vinSerialNumber: row[6] ?? '',
                licence: row[8] ?? '',
                assetContact: row[9] ?? '',
                department: row[10] ?? '',
                class: row[12] ?? '',
                meterReadings,
                acquireDate: (row[15] ?? '') === '' ? undefined : dateToString(acquireDate),
                status: row[16] ?? ''
            };
            const grossVehicleWeight = Number.parseInt(row[18] ?? '');
            if (Number.isFinite(grossVehicleWeight)) {
                asset.grossVehicleWeight = grossVehicleWeight;
            }
            results.data.push(asset);
        }
    }
    return results;
}
