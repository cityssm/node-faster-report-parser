import type { DateString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
export declare const w311ReportName = "W311 - Active Work Orders by Shop";
export interface W311RepairReportData {
    status: string;
    technician: string;
    repair: string;
}
export interface W311WorkOrderReportData {
    workOrderNumber: number;
    assetNumber: string;
    openedDate: DateString;
    daysOpen: number;
    status: string;
    repairs: W311RepairReportData[];
}
export interface W311ShopReportData {
    shop: string;
    shopName: string;
    workOrders: W311WorkOrderReportData[];
}
export interface W311ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w311ReportName;
    data: W311ShopReportData[];
}
/**
 * Parses the XLSX version of the "W311 - Active Work Orders by Shop" report.
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export declare function parseW311ExcelReport(pathToXlsxFile: string): W311ExcelReportResults;
