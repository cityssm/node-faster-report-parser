// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable no-secrets/no-secrets */

import assert from 'node:assert'
import { describe, it } from 'node:test'

import { isValidDateString, isValidTimeString } from '@cityssm/utils-datetime'

import {
  parseW114ExcelReport,
  parseW200ExcelReport,
  parseW201ExcelReport,
  parseW217ExcelReport,
  parseW223ExcelReport,
  parseW311ExcelReport,
  parseW604ExcelReport,
  w114ReportName,
  w200ReportName,
  w201ReportName,
  w217ReportName,
  w223ReportName,
  w311ReportName,
  w604ReportName
} from '../xlsxReports.js'

await describe('node-faster-report-parser/xlsx', async () => {
  await it('Parses "W114 - Asset Master List"', () => {
    const results = parseW114ExcelReport('./samples/w114_assetMasterList.xlsx')

    console.log(results)

    assert.strictEqual(results.reportName, w114ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)

    console.log(results.data[0])
    // console.log(results.data[0].storeroomDescription)

    for (const asset of results.data) {
      assert.notStrictEqual(asset.assetNumber, '')
    }
  })

  await it('Parses "W200 - Inventory Report"', () => {
    const results = parseW200ExcelReport('./samples/w200.xlsx')

    console.log(results)

    assert.strictEqual(results.reportName, w200ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)

    // console.log(results.data[0].storeroom)
    // console.log(results.data[0].storeroomDescription)

    for (const storeroom of results.data) {
      assert.notStrictEqual(storeroom.storeroom, '')

      assert(storeroom.items.length > 0)

      // console.log(storeroom.items[0])

      for (const item of storeroom.items) {
        assert.notStrictEqual(item.itemNumber, '')
        assert.notStrictEqual(item.itemName, '')
      }
    }
  })

  await it('Parses "W201 - Inventory Item Issue Report"', () => {
    const results = parseW201ExcelReport('./samples/w201_inventoryItemIssueReport.xlsx')

    console.log(results)

    assert.strictEqual(results.reportName, w201ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)
  })

  await it('Parses "W217 - Direct Charge Transactions"', () => {
    const results = parseW217ExcelReport(
      './samples/w217_directChargeTransactions.xlsx'
    )

    // console.log(results)

    assert.strictEqual(results.reportName, w217ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)

    // console.log(results.data[0].documentNumber)
    // console.log(results.data[0].symptom)

    for (const directChargeDocument of results.data) {
      assert.notStrictEqual(directChargeDocument.documentNumber, '')

      assert(directChargeDocument.transactions.length > 0)

      // console.log(directChargeDocument.transactions[0])

      for (const transaction of directChargeDocument.transactions) {
        assert.notStrictEqual(transaction.storeroom, '')
        assert.notStrictEqual(transaction.itemNumber, '')
        assert.notStrictEqual(transaction.itemName, '')
        assert.notStrictEqual(transaction.repairDescription, '')
        assert(isValidDateString(transaction.transactionDate))
      }
    }
  })

  await describe('W223 - Inventory Transaction Details Report', async () => {
    await it('Parses with page breaks', () => {
      const results = parseW223ExcelReport(
        './samples/w223_inventoryTransactionDetails.xlsx',
        {
          inverseAmounts: true
        }
      )

      // console.log(results)

      assert.strictEqual(results.reportName, w223ReportName)
      assert(isValidDateString(results.exportDate))
      assert(isValidTimeString(results.exportTime))

      assert(results.data.length > 0)

      for (const storeroom of results.data) {
        assert.notStrictEqual(storeroom.storeroom, '')

        assert(storeroom.transactions.length > 0)

        // console.log(storeroom.transactions[0])

        for (const transaction of storeroom.transactions) {
          assert.notStrictEqual(transaction.itemNumber, '')
          assert.notStrictEqual(transaction.itemName, '')

          if (
            transaction.transactionType === 'DC ISSUE' ||
            transaction.transactionType === 'WO ISSUE'
          ) {
            // inverseAmounts = true
            assert(transaction.quantity >= 0)
          }

          assert.strictEqual(
            transaction.quantity * transaction.unitTrueCost,
            transaction.extCost
          )

          if (
            transaction.transactionType === 'DC ISSUE' ||
            transaction.transactionType === 'WO ISSUE' ||
            transaction.transactionType === 'RETURN TO INV' ||
            transaction.transactionType === 'RETURN BIN'
          ) {
            assert(transaction.documentNumber !== undefined)
            assert(!Number.isNaN(transaction.documentNumber))
          }
        }
      }
    })

    await it('Parses without page breaks', () => {
      const results = parseW223ExcelReport(
        './samples/w223_inventoryTransactionDetails_noPageBreaks.xlsx'
      )

      // console.log(results)

      assert.strictEqual(results.reportName, w223ReportName)
      assert(isValidDateString(results.exportDate))
      assert(isValidTimeString(results.exportTime))

      assert(results.data.length > 0)

      // console.log(results.data[0])

      for (const storeroom of results.data) {
        assert.notStrictEqual(storeroom.storeroom, '')

        assert(storeroom.transactions.length > 0)

        console.log(storeroom.transactions[0])

        for (const transaction of storeroom.transactions) {
          assert.notStrictEqual(transaction.itemNumber, '')
          assert.notStrictEqual(transaction.itemName, '')

          if (
            transaction.transactionType === 'DC ISSUE' ||
            transaction.transactionType === 'WO ISSUE'
          ) {
            // inverseAmounts = false
            assert(transaction.quantity <= 0)
          }

          assert.strictEqual(
            transaction.quantity * transaction.unitTrueCost,
            transaction.extCost
          )

          if (
            transaction.transactionType === 'DC ISSUE' ||
            transaction.transactionType === 'WO ISSUE' ||
            transaction.transactionType === 'RETURN TO INV' ||
            transaction.transactionType === 'RETURN BIN'
          ) {
            assert(transaction.documentNumber !== undefined)
            assert(!Number.isNaN(transaction.documentNumber))
          }
        }
      }
    })
  })

  await it('Parses "W311 - Active Work Orders by Shop"', () => {
    const results = parseW311ExcelReport(
      './samples/w311_activeWorkOrdersByShop.xlsx'
    )

    // console.log(JSON.stringify(results, undefined, 2))

    assert.strictEqual(results.reportName, w311ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)
    assert((results.data.at(0)?.workOrders.length ?? 0) > 0)
    assert((results.data.at(0)?.workOrders.at(0)?.repairs.length ?? 0) > 0)
  })

  await it('Parses "W604 - Integration Log Viewer"', () => {
    const results = parseW604ExcelReport(
      './samples/w604_integrationLogViewer.xlsx'
    )

    // console.log(JSON.stringify(results, undefined, 2))

    assert.strictEqual(results.reportName, w604ReportName)
    assert(isValidDateString(results.exportDate))
    assert(isValidTimeString(results.exportTime))

    assert(results.data.length > 0)
  })
})
