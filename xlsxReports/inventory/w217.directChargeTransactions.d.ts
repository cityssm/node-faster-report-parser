import { type DateString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
export interface W217DocumentReportData {
    documentNumber: number;
    contact: string;
    documentStatus: string;
    symptom: string;
    shop: string;
    transactions: W217TransactionReportData[];
}
export interface W217TransactionReportData {
    storeroom: string;
    itemNumber: string;
    itemName: string;
    technician: string;
    repairDescription: string;
    transactionDate: DateString;
    quantity: number;
    cost: number;
}
export declare const w217ReportName = "W217 - Direct Charge Transaction Detail";
export interface W217ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w217ReportName;
    data: W217DocumentReportData[];
}
/**
 * Parses the XLSX version of the "W217 - Direct Charge Transactions" report.
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export declare function parseW217ExcelReport(pathToXlsxFile: string): W217ExcelReportResults;
