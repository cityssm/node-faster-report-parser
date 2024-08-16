import type { ParseFasterCsvReportOptions } from '../csvTypes.js';
declare const w600ColumnReturnNames: {
    readonly textbox4: "tableName";
    readonly textbox5: "code";
    readonly textbox6: "codeDescription";
};
export type W600ReportRow = Record<(typeof w600ColumnReturnNames)[keyof typeof w600ColumnReturnNames], string>;
/**
 * W600 - Pick List Values Report
 */
export declare const w600: ParseFasterCsvReportOptions<W600ReportRow>;
export {};
