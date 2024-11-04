import * as XLSX from 'xlsx';
import type { FasterExcelReportResults, XlsxDataRow } from './xlsxTypes.js';
/**
 * Returns an XLSX WorkBook object
 * @param pathToXlsxFile - Path to the report
 * @returns XLSX WorkBook object
 */
export declare function getXLSXWorkBook(pathToXlsxFile: string): XLSX.WorkBook;
/**
 * Parses an XLSX WorkSheet into usable data.
 * @param workSheet - An XLSX WorkSheet object.
 * @param formatAsStrings - Set to `true` when dates are included.
 * @returns - The sheet data as strings, array[row][column]
 */
export declare function getXLSXWorkSheetData(workSheet: XLSX.WorkSheet, formatAsStrings?: boolean): XlsxDataRow[];
interface ExtractReportMetadataOptions {
    /** The first row is 1. */
    reportNameRowNumber: number;
    /** The first row is 1. */
    exportDateTimeRowNumber: number;
}
/**
 * Extracts the report name, parameters, and versions from the last sheet in the workbook.
 * @param workbook - A FASTER Web Excel report workbook.
 * @param options - Options
 * @returns - An object with the standard Excel results.
 */
export declare function extractReportMetadata(workbook: XLSX.WorkBook, options: ExtractReportMetadataOptions): FasterExcelReportResults;
export {};
