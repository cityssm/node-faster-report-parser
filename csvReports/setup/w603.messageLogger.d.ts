import type { ParseFasterCsvReportOptions } from '../csvTypes.js';
declare const w603ColumnReturnNames: {
    readonly Textbox4: "messageId";
    readonly Textbox5: "messageDateTime";
    readonly Textbox14: "messageType";
    readonly Textbox15: "message";
    readonly Textbox129: "exceptionDetails";
};
export type W603ReportRow = Record<(typeof w603ColumnReturnNames)[keyof typeof w603ColumnReturnNames], string>;
/**
 * W600 - Pick List Values Report
 */
export declare const w603: ParseFasterCsvReportOptions<W603ReportRow>;
export {};
