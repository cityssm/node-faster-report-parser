// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { dateToString, dateToTimeString } from '@cityssm/utils-datetime';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from '../../debug.config.js';
import { extractReportMetadata, getXLSXWorkBook, getXLSXWorkSheetData } from '../helpers.js';
const debug = Debug(`${DEBUG_NAMESPACE}:xlsx:w223`);
export const w223ReportName = 'W223 - Inventory Transaction Details Report';
function isStoreroomRow(row) {
    return (row.length === 16 &&
        (row[0] ?? '').startsWith('STOREROOM: ') &&
        row[5] === undefined);
}
function isDataRow(row) {
    return (row.length === 16 &&
        (row[2] ?? '') !== '' &&
        Number.isFinite(Number.parseFloat(row[9] ?? '')));
}
function populateTransactionDetailsMetadata(transactionData) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (transactionData.transactionType) {
        case 'DC ISSUE':
        case 'WO ISSUE': {
            if (transactionData.transactionDetails.startsWith('DOCUMENT #: ')) {
                transactionData.documentNumber = Number.parseInt(transactionData.transactionDetails
                    .slice(transactionData.transactionDetails.indexOf(':') + 1)
                    .trim());
            }
            break;
        }
        case 'RETURN TO INV': {
            if (transactionData.transactionDetails.startsWith('FROM DC ISSUE: ') ||
                transactionData.transactionDetails.startsWith('FROM WO ISSUE: ')) {
                transactionData.documentNumber = Number.parseInt(transactionData.transactionDetails
                    .slice(transactionData.transactionDetails.indexOf(':') + 1)
                    .trim());
            }
            break;
        }
        case 'RETURN BIN': {
            if (transactionData.transactionDetails.startsWith('FROM DOC ISSUE: ') &&
                transactionData.transactionDetails.includes(' TO VEN: ')) {
                transactionData.documentNumber = Number.parseInt(transactionData.transactionDetails
                    .slice(transactionData.transactionDetails.indexOf(':') + 1, transactionData.transactionDetails.indexOf(' TO VEN: '))
                    .trim());
                transactionData.vendorNumber = Number.parseInt(transactionData.transactionDetails
                    .slice(transactionData.transactionDetails.indexOf(' TO VEN: ') + 9)
                    .trim());
            }
        }
    }
    return transactionData;
}
/**
 * Fixes unitTrueCost and extCost values the become zero when items are fully returned.
 * @param results - W217 Report Data
 * @returns - A corrected report.
 */
function fixZeroedCostsIfApplicable(results) {
    if (results.version.report !== '20240108.1200' ||
        results.version.script !== '20240104.1200') {
        return;
    }
    const transactionsToConsiderUpdating = [];
    for (const storeroomData of results.data) {
        for (const transactionData of storeroomData.transactions) {
            if ((transactionData.transactionType === 'DC ISSUE' ||
                transactionData.transactionType === 'WO ISSUE') &&
                transactionData.unitTrueCost === 0) {
                transactionsToConsiderUpdating.push(transactionData);
            }
            else if (transactionData.transactionType === 'RETURN TO INV' ||
                transactionData.transactionType === 'RETURN BIN') {
                const transactionsToUpdate = transactionsToConsiderUpdating.filter((possibleTransaction) => possibleTransaction.unitTrueCost === 0 &&
                    transactionData.itemNumber === possibleTransaction.itemNumber &&
                    transactionData.createdDateTime ===
                        possibleTransaction.modifiedDateTime);
                for (const transactionToUpdate of transactionsToUpdate) {
                    debug(`Fixing transaction: ${JSON.stringify(transactionToUpdate)}`);
                    transactionToUpdate.unitTrueCost = transactionData.unitTrueCost;
                    transactionToUpdate.extCost =
                        transactionToUpdate.quantity * transactionToUpdate.unitTrueCost;
                }
            }
        }
    }
    debug(transactionsToConsiderUpdating);
}
/**
 * Parses the XLSX version of the "W223 - Inventory Transaction Details Report".
 * @param pathToXlsxFile - Path to the report.
 * @param options - Optional.
 * @param options.inverseAmounts - When `true`, the signs on the quantity and cost values will be inversed, making "ISSUE" records positive.
 * @returns - The parsed results.
 */
export function parseW223ExcelReport(pathToXlsxFile, options) {
    const workbook = getXLSXWorkBook(pathToXlsxFile);
    /*
     * Validate workbook
     */
    const results = extractReportMetadata(workbook, {
        reportNameRowNumber: 4,
        exportDateTimeRowNumber: 5
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (results.reportName !== w223ReportName) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid reportName: ${results.reportName}`);
    }
    /*
     * Loop through sheets
     */
    const valueMultiplier = (options?.inverseAmounts ?? false) ? -1 : 1;
    debug(`Looping through ${workbook.SheetNames.length} sheets`);
    for (const sheetName of workbook.SheetNames) {
        // eslint-disable-next-line security/detect-object-injection
        const worksheetData = getXLSXWorkSheetData(workbook.Sheets[sheetName]);
        /*
         * Loop through rows
         */
        for (const row of worksheetData) {
            if (isStoreroomRow(row)) {
                const storeroomRawText = row[0] ?? '';
                results.data.push({
                    storeroom: storeroomRawText
                        .slice(11, storeroomRawText.indexOf(' - '))
                        .trim(),
                    storeroomDescription: storeroomRawText
                        .slice(storeroomRawText.indexOf(' - ') + 3)
                        .trim(),
                    transactions: []
                });
            }
            else if (isDataRow(row)) {
                const transactionDate = new Date(row[5] ?? '');
                const createdDate = new Date(row[14] ?? '');
                const modifiedDate = new Date(row[15] ?? '');
                const transactionData = {
                    itemNumber: row[2] ?? '',
                    itemName: row[3] ?? '',
                    transactionDateTime: `${dateToString(transactionDate)} ${dateToTimeString(transactionDate)}`,
                    transactionType: (row[6] ??
                        ''),
                    transactionDetails: (row[8] ??
                        ''),
                    quantity: Number.parseFloat(row[9] ?? '') * valueMultiplier,
                    unitTrueCost: Number.parseFloat(row[10] ?? ''),
                    extCost: Number.parseFloat(row[11] ?? '') * valueMultiplier,
                    createdDateTime: `${dateToString(createdDate)} ${dateToTimeString(createdDate)}`,
                    modifiedDateTime: `${dateToString(modifiedDate)} ${dateToTimeString(modifiedDate)}`
                };
                populateTransactionDetailsMetadata(transactionData);
                results.data.at(-1)?.transactions.push(transactionData);
            }
        }
    }
    fixZeroedCostsIfApplicable(results);
    return results;
}
