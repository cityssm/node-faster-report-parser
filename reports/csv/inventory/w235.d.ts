import type { ParseFasterCsvReportOptions } from '../csvTypes.js';
declare const w235ColumnReturnNames: {
    readonly textbox38: "storeroom";
    readonly PartNumber: "itemNumber";
    readonly PartDesc: "itemName";
    readonly BinLocation: "binLocation";
};
declare const w235ColumnNumericReturnNames: {
    readonly InventoryQty: "quantityInStock";
    readonly FillQty: "reservedQuantity";
    readonly TransferQty: "unacceptedTransferQuantity";
    readonly ReturnPartIssueQty: "unshippedReturnIssueQuantity";
    readonly ReturnInventoryQty: "unshippedReturnInventoryQuantity";
    readonly textbox140: "averageTrueCost";
    readonly MarkupItem: "defaultMarkup";
    readonly Receive_qty: "averageTrueCostWithMarkup";
    readonly AdjustUp_Qty: "stockExtValue";
    readonly RecvReturn_Qty: "stockExtValueWithMarkup";
};
export type W235ReportRow = Record<(typeof w235ColumnReturnNames)[keyof typeof w235ColumnReturnNames], string> & Record<(typeof w235ColumnNumericReturnNames)[keyof typeof w235ColumnNumericReturnNames], number | undefined>;
/**
 * W235 - Inventory Snapshot
 */
export declare const w235: ParseFasterCsvReportOptions<W235ReportRow>;
export {};
