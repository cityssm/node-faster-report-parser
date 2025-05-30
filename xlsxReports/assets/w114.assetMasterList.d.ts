import { type DateString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
interface W114AssetMeterReading {
    actualReading: number;
    meterType: string;
}
export interface W114AssetReportData {
    assetNumber: string;
    financialReferenceNumber: string;
    year: number;
    make: string;
    model: string;
    vinSerialNumber: string;
    licence: string;
    assetContact: string;
    department: string;
    class: string;
    meterReadings: W114AssetMeterReading[];
    acquireDate?: DateString;
    status: string;
    grossVehicleWeight?: number;
    usageCode: string;
}
export declare const w114ReportName = "W114 - Asset Master List";
export interface W114ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w114ReportName;
    data: W114AssetReportData[];
}
/**
 * Parses the XLSX version of the "W114 - Asset Master List".
 * Tested with version "20240603".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export declare function parseW114ExcelReport(pathToXlsxFile: string): W114ExcelReportResults;
export {};
