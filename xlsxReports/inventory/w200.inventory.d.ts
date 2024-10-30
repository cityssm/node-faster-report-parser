import type { FasterExcelReportResults } from '../xlsxTypes.js';
export interface W200StoreroomReportData {
    storeroom: string;
    storeroomDescription: string;
    items: W200ItemReportData[];
}
export interface W200ItemReportData {
    itemNumber: string;
    itemName: string;
    binLocation: string;
    quantityInStock: number;
    reservedQuantity: number;
    unacceptedTransferQuantity: number;
    unshippedRetIssQuantity: number;
    unshippedRetInvQuantity: number;
    averageTrueCost: number;
    defaultMarkup: number;
    averageTrueCostWithMarkup: number;
    stockExtValue: number;
    stockExtValueWithMarkup: number;
}
export declare const w200ReportName = "W200 - Inventory Report";
export interface W200ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w200ReportName;
    data: W200StoreroomReportData[];
}
/**
 * Parses the XLSX version of the "W200 - Inventory Report".
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export declare function parseW200ExcelReport(pathToXlsxFile: string): W200ExcelReportResults;
