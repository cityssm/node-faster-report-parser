import type { ParseFasterCsvReportOptions } from '../csvTypes.js';
declare const w200sColumnReturnNames: {
    readonly textbox267: "storeroom";
    readonly textbox32: "groupingWithinStoreroom";
    readonly PartNumber: "itemNumber";
    readonly PartDesc: "itemName";
    readonly BinLocation: "binLocation";
};
declare const w200sColumnNumericReturnNames: {
    readonly textbox140: "averageTrueCost";
    readonly DefaultMarkup: "defaultMarkup";
    readonly Receive_qty: "averageTrueCostWithMarkup";
    readonly textbox46: "quantityInStock";
    readonly AdjustUp_Qty: "stockExtValue";
    readonly RecvReturn_Qty: "stockExtValueWithMarkup";
};
export type W200SReportRow = Record<(typeof w200sColumnReturnNames)[keyof typeof w200sColumnReturnNames], string> & Record<(typeof w200sColumnNumericReturnNames)[keyof typeof w200sColumnNumericReturnNames], number | undefined>;
/**
 * W200S - Inventory Summary Report
 */
export declare const w200s: ParseFasterCsvReportOptions<W200SReportRow>;
export {};
