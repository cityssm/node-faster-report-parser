import type { FasterCsvReportResults, ParseFasterCsvReportOptions } from './csvReports/csvTypes.js';
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
    w200s: ParseFasterCsvReportOptions<import("./csvReports/inventory/w200s.inventorySummary.js").W200SReportRow>;
    /**
     * W223 - Inventory Transaction Details Report
     */
    w223: ParseFasterCsvReportOptions<import("./csvReports/inventory/w223.inventoryTransactionDetails.js").W223ReportRow>;
    /**
     * W235 - Inventory Snapshot
     */
    w235: ParseFasterCsvReportOptions<import("./csvReports/inventory/w235.inventorySnapshot.js").W235ReportRow>;
    /**
     * W600 - Pick List Values Report
     */
    w600: ParseFasterCsvReportOptions<import("./csvReports/setup/w600.pickListValues.js").W600ReportRow>;
};
export type SupportedFasterCsvReportName = keyof typeof fasterCsvReportOptions | Capitalize<keyof typeof fasterCsvReportOptions>;
export type { W200SReportRow } from './csvReports/inventory/w200s.inventorySummary.js';
export type { W223ReportRow } from './csvReports/inventory/w223.inventoryTransactionDetails.js';
export type { W235ReportRow } from './csvReports/inventory/w235.inventorySnapshot.js';
export type { W600ReportRow } from './csvReports/setup/w600.pickListValues.js';
