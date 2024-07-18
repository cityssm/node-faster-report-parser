const w223ColumnReturnNames = {
    textbox126: 'storeroom',
    textbox163: 'item',
    textbox164: 'itemNumber',
    textbox33: 'itemName',
    textbox95: 'transactionDateTime',
    textbox34: 'transactionType',
    textbox36: 'transactionDetails',
    textbox1: 'createdDateTime'
};
const w223ColumnNumericReturnNames = {
    textbox37: 'quantity',
    textbox39: 'unitTrueCost'
};
/**
 * W223 - Inventory Transaction Details Report
 */
export const w223 = {
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
};
