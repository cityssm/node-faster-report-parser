import { type DateString, type TimeString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
export interface W604MessageReportData {
    messageId: number;
    timestampDate: DateString;
    timestampTime: TimeString;
    logLevel: string;
    message: string;
    transactionData: string;
}
export declare const w604ReportName = "W604 - Integration Log Viewer";
export interface W604ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w604ReportName;
    data: W604MessageReportData[];
}
/**
 * Parses the XLSX version of the "W604 - Integration Log Viewer".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export declare function parseW604ExcelReport(pathToXlsxFile: string): W604ExcelReportResults;
