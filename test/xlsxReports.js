import assert from 'node:assert';
import { describe, it } from 'node:test';
import { isValidDateString, isValidTimeString } from '@cityssm/utils-datetime';
import { parseW200ExcelReport, parseW217ExcelReport, parseW223ExcelReport, w200ReportName, w217ReportName, w223ReportName } from '../xlsxReports.js';
await describe('node-faster-report-parser/xlsx', async () => {
    await it('Parses "W200 - Inventory Report"', () => {
        const results = parseW200ExcelReport('./samples/w200.xlsx');
        // console.log(results)
        assert.strictEqual(results.reportName, w200ReportName);
        assert(isValidDateString(results.exportDate));
        assert(isValidTimeString(results.exportTime));
        assert(results.data.length > 0);
        // console.log(results.data[0].storeroom)
        // console.log(results.data[0].storeroomDescription)
        for (const storeroom of results.data) {
            assert.notStrictEqual(storeroom.storeroom, '');
            assert(storeroom.items.length > 0);
            // console.log(storeroom.items[0])
            for (const item of storeroom.items) {
                assert.notStrictEqual(item.itemNumber, '');
                assert.notStrictEqual(item.itemName, '');
            }
        }
    });
    await it('Parses "W217 - Direct Charge Transactions"', () => {
        const results = parseW217ExcelReport(
        // eslint-disable-next-line no-secrets/no-secrets
        './samples/w217_directChargeTransactions.xlsx');
        // console.log(results)
        assert.strictEqual(results.reportName, w217ReportName);
        assert(isValidDateString(results.exportDate));
        assert(isValidTimeString(results.exportTime));
        assert(results.data.length > 0);
        // console.log(results.data[0].documentNumber)
        // console.log(results.data[0].symptom)
        for (const directChargeDocument of results.data) {
            assert.notStrictEqual(directChargeDocument.documentNumber, '');
            assert(directChargeDocument.transactions.length > 0);
            // console.log(directChargeDocument.transactions[0])
            for (const transaction of directChargeDocument.transactions) {
                assert.notStrictEqual(transaction.storeroom, '');
                assert.notStrictEqual(transaction.itemNumber, '');
                assert.notStrictEqual(transaction.itemName, '');
                assert.notStrictEqual(transaction.repairDescription, '');
                assert(isValidDateString(transaction.transactionDate));
            }
        }
    });
    await describe('W223 - Inventory Transaction Details Report', async () => {
        await it('Parses with page breaks', () => {
            const results = parseW223ExcelReport('./samples/w223_inventoryTransactionDetails.xlsx', {
                inverseAmounts: true
            });
            // console.log(results)
            assert.strictEqual(results.reportName, w223ReportName);
            assert(isValidDateString(results.exportDate));
            assert(isValidTimeString(results.exportTime));
            assert(results.data.length > 0);
            for (const storeroom of results.data) {
                assert.notStrictEqual(storeroom.storeroom, '');
                assert(storeroom.transactions.length > 0);
                // console.log(storeroom.transactions[0])
                for (const transaction of storeroom.transactions) {
                    assert.notStrictEqual(transaction.itemNumber, '');
                    assert.notStrictEqual(transaction.itemName, '');
                    if (transaction.transactionType === 'DC ISSUE' || transaction.transactionType === 'WO ISSUE') {
                        // inverseAmounts = true
                        assert(transaction.quantity >= 0);
                    }
                    assert.strictEqual(transaction.quantity * transaction.unitTrueCost, transaction.extCost);
                    if (transaction.transactionType === 'DC ISSUE' ||
                        transaction.transactionType === 'WO ISSUE' ||
                        transaction.transactionType === 'RETURN TO INV' ||
                        transaction.transactionType === 'RETURN BIN') {
                        assert(transaction.documentNumber !== undefined);
                        assert(!Number.isNaN(transaction.documentNumber));
                    }
                }
            }
        });
        await it('Parses without page breaks', () => {
            const results = parseW223ExcelReport(
            // eslint-disable-next-line no-secrets/no-secrets
            './samples/w223_inventoryTransactionDetails_noPageBreaks.xlsx');
            // console.log(results)
            assert.strictEqual(results.reportName, w223ReportName);
            assert(isValidDateString(results.exportDate));
            assert(isValidTimeString(results.exportTime));
            assert(results.data.length > 0);
            // console.log(results.data[0])
            for (const storeroom of results.data) {
                assert.notStrictEqual(storeroom.storeroom, '');
                assert(storeroom.transactions.length > 0);
                console.log(storeroom.transactions[0]);
                for (const transaction of storeroom.transactions) {
                    assert.notStrictEqual(transaction.itemNumber, '');
                    assert.notStrictEqual(transaction.itemName, '');
                    if (transaction.transactionType === 'DC ISSUE' || transaction.transactionType === 'WO ISSUE') {
                        // inverseAmounts = false
                        assert(transaction.quantity <= 0);
                    }
                    assert.strictEqual(transaction.quantity * transaction.unitTrueCost, transaction.extCost);
                    if (transaction.transactionType === 'DC ISSUE' ||
                        transaction.transactionType === 'WO ISSUE' ||
                        transaction.transactionType === 'RETURN TO INV' ||
                        transaction.transactionType === 'RETURN BIN') {
                        assert(transaction.documentNumber !== undefined);
                        assert(!Number.isNaN(transaction.documentNumber));
                    }
                }
            }
        });
    });
});
