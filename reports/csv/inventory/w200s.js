const w200sColumnReturnNames = {
    textbox267: 'storeroom',
    textbox32: 'groupingWithinStoreroom',
    PartNumber: 'itemNumber',
    PartDesc: 'itemName',
    BinLocation: 'binLocation',
};
const w200sColumnNumericReturnNames = {
    textbox140: 'averageTrueCost',
    DefaultMarkup: 'defaultMarkup',
    Receive_qty: 'averageTrueCostWithMarkup',
    textbox46: 'quantityInStock',
    AdjustUp_Qty: 'stockExtValue',
    // eslint-disable-next-line no-secrets/no-secrets
    RecvReturn_Qty: 'stockExtValueWithMarkup'
};
/**
 * W200S - Inventory Summary Report
 */
export const w200s = {
    columnReturnNames: w200sColumnReturnNames,
    columnNumericReturnNames: w200sColumnNumericReturnNames,
    columnParameterReturnNames: {
        Textbox5: 'timeZone',
        textbox282: 'storeroom',
        textbox164: 'groupingWithinStoreroom',
        textbox176: 'itemCategory',
        textbox155: 'stockType',
        textbox189: 'itemStatus',
        // eslint-disable-next-line no-secrets/no-secrets
        textbox173: 'includeItemsWithZeroQuantity'
    },
    columnVersionReturnNames: {
        textbox203: 'script'
    }
};
