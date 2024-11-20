import { type DateString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
export interface W201ItemReportData {
    documentNumber: number;
    assetNumber?: string;
    itemNumber: string;
    itemName: string;
    issuedDate: DateString;
    repairReason: string;
    issuedBy: string;
    quantity: number;
    issuePrice: number;
    extendedCost: number;
}
export declare const w201ReportName = "W201 - Inventory Item Issue Report";
export interface W201ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w201ReportName;
    data: W201ItemReportData[];
}
/**
 * Parses the XLSX version of the "W201 - Inventory Item Issue Report".
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export declare function parseW201ExcelReport(pathToXlsxFile: string): W201ExcelReportResults;
