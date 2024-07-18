import type { FasterCsvReportResults, ParseFasterCsvReportOptions } from './reports/csv/csvTypes.js';
/**
 * Parses CSV files of Standard FASTER reports.
 * @param pathToCsvFile - Path to a FASTER CSV file.
 * @param parsingOptions - Parsing options, specific to the type of report.
 * @returns - The parsed results.
 */
export declare function parseFasterCsvReport<T>(pathToCsvFile: string, parsingOptions: ParseFasterCsvReportOptions<T>): Promise<FasterCsvReportResults<T>>;
export declare const fasterCsvReportOptions: {
    /**
     * W200S - Inventory Summary Report
     */
    w200s: ParseFasterCsvReportOptions<import("./reports/csv/inventory/w200s.js").W200SReportRow>;
    /**
     * W223 - Inventory Transaction Details Report
     */
    w223: ParseFasterCsvReportOptions<import("./reports/csv/inventory/w223.js").W223ReportRow>;
    /**
     * W235 - Inventory Snapshot
     */
    w235: ParseFasterCsvReportOptions<import("./reports/csv/inventory/w235.js").W235ReportRow>;
    /**
     * W600 - Pick List Values Report
     */
    w600: ParseFasterCsvReportOptions<import("./reports/csv/setup/w600.js").W600ReportRow>;
};
export type SupportedFasterCsvReportName = keyof typeof fasterCsvReportOptions | Capitalize<keyof typeof fasterCsvReportOptions>;
export type { W200SReportRow } from './reports/csv/inventory/w200s.js';
export type { W223ReportRow } from './reports/csv/inventory/w223.js';
export type { W235ReportRow } from './reports/csv/inventory/w235.js';
export type { W600ReportRow } from './reports/csv/setup/w600.js';
