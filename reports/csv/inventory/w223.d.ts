import type { ParseFasterCsvReportOptions } from '../csvTypes.js';
declare const w223ColumnReturnNames: {
    readonly textbox126: "storeroom";
    readonly textbox163: "item";
    readonly textbox164: "itemNumber";
    readonly textbox33: "itemName";
    readonly textbox95: "transactionDateTime";
    readonly textbox34: "transactionType";
    readonly textbox36: "transactionDetails";
    readonly textbox1: "createdDateTime";
};
declare const w223ColumnNumericReturnNames: {
    readonly textbox37: "quantity";
    readonly textbox39: "unitTrueCost";
};
export type W223ReportRow = Record<(typeof w223ColumnReturnNames)[keyof typeof w223ColumnReturnNames], string> & Record<(typeof w223ColumnNumericReturnNames)[keyof typeof w223ColumnNumericReturnNames], number | undefined>;
/**
 * W223 - Inventory Transaction Details Report
 */
export declare const w223: ParseFasterCsvReportOptions<W223ReportRow>;
export {};
