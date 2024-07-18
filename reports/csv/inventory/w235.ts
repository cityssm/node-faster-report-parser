import type { ParseFasterCsvReportOptions } from '../csvTypes.js'

const w235ColumnReturnNames = {
  textbox38: 'storeroom',
  PartNumber: 'itemNumber',
  PartDesc: 'itemName',
  BinLocation: 'binLocation'
} as const

const w235ColumnNumericReturnNames = {
  InventoryQty: 'quantityInStock',
  FillQty: 'reservedQuantity',
  TransferQty: 'unacceptedTransferQuantity',
  ReturnPartIssueQty: 'unshippedReturnIssueQuantity',
  ReturnInventoryQty: 'unshippedReturnInventoryQuantity',
  textbox140: 'averageTrueCost',
  MarkupItem: 'defaultMarkup',
  Receive_qty: 'averageTrueCostWithMarkup',
  AdjustUp_Qty: 'stockExtValue',
  // eslint-disable-next-line no-secrets/no-secrets
  RecvReturn_Qty: 'stockExtValueWithMarkup'
} as const

export type W235ReportRow = Record<
  (typeof w235ColumnReturnNames)[keyof typeof w235ColumnReturnNames],
  string
> &
  Record<
    (typeof w235ColumnNumericReturnNames)[keyof typeof w235ColumnNumericReturnNames],
    number | undefined
  >

/**
 * W235 - Inventory Snapshot
 */
export const w235: ParseFasterCsvReportOptions<W235ReportRow> = {
  columnReturnNames: w235ColumnReturnNames,
  columnNumericReturnNames: w235ColumnNumericReturnNames,
  columnParameterReturnNames: {
    Textbox341: 'timeZone',
    Textbox100: 'snapshot',
    textbox164: 'groupingWithinStoreroom',
    textbox157: 'storeroom',
    textbox176: 'itemCategory',
    textbox366: 'itemStatus',
    Textbox651: 'itemType',
    Textbox664: 'itemUsage',
    textbox155: 'stockType',
    Textbox677: 'itemNumber',
    Textbox690: 'itemName',
    Textbox320: 'binLocation',
    // eslint-disable-next-line no-secrets/no-secrets
    textbox173: 'includeItemsWithZeroQuantity'
  },
  columnVersionReturnNames: {
    textbox203: 'script'
  }
}
