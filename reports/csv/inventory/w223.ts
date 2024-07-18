import type { ParseFasterCsvReportOptions } from '../csvTypes.js'

const w223ColumnReturnNames = {
  textbox126: 'storeroom',
  textbox163: 'item',
  textbox164: 'itemNumber',
  textbox33: 'itemName',
  textbox95: 'transactionDateTime',
  textbox34: 'transactionType',
  textbox36: 'transactionDetails',
  textbox1: 'createdDateTime'
} as const

const w223ColumnNumericReturnNames = {
  textbox37: 'quantity',
  textbox39: 'unitTrueCost'
} as const

export type W223ReportRow = Record<
  (typeof w223ColumnReturnNames)[keyof typeof w223ColumnReturnNames],
  string
> &
  Record<
    (typeof w223ColumnNumericReturnNames)[keyof typeof w223ColumnNumericReturnNames],
    number | undefined
  >

/**
 * W223 - Inventory Transaction Details Report
 */
export const w223: ParseFasterCsvReportOptions<W223ReportRow> = {
  columnReturnNames: w223ColumnReturnNames,
  columnNumericReturnNames: w223ColumnNumericReturnNames,
  columnParameterReturnNames: {
    textbox11: 'startDate',
    textbox303: 'endDate',
    textbox72: 'timeZone',
    textbox98: 'secondaryGrouping',
    textbox249: 'storeroom',
    textbox253: 'itemCategory',
    textbox80: 'itemType',
    textbox434: 'itemStockType',
    textbox435: 'itemStatus',
    textbox65: 'itemUsage',
    textbox457: 'itemNumber'
  },
  columnVersionReturnNames: {
    textbox429: 'script'
  }
}
