import Debug from 'debug'

import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug('faster-report-parser:xlsx:w200')

export interface W200StoreroomReportData {
  storeroom: string
  storeroomDescription: string
  items: W200ItemReportData[]
}

export interface W200ItemReportData {
  itemNumber: string
  itemName: string
  binLocation: string
  quantityInStock: number
  reservedQuantity: number
  unacceptedTransferQuantity: number
  unshippedRetIssQuantity: number
  unshippedRetInvQuantity: number
  averageTrueCost: number
  defaultMarkup: number
  averageTrueCostWithMarkup: number
  stockExtValue: number
  stockExtValueWithMarkup: number
}

export const w200ReportName = 'W200 - Inventory Report'

export interface W200ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w200ReportName
  data: W200StoreroomReportData[]
}

function isStoreroomRow(row: XlsxDataRow): boolean {
  return row.length === 17 && (row[0] ?? '').startsWith('STOREROOM: ')
}

function isDataRow(row: XlsxDataRow): boolean {
  return (
    row.length === 17 &&
    // Should contain item number
    (row[0] ?? '') !== '' &&
    // Should contain item name
    (row[1] ?? '') !== '' &&
    // Should contain number in "QTY IN STOCK"
    (row[4] ?? '') !== '' &&
    Number.isFinite(Number.parseFloat(row[4] ?? ''))
  )
}

/**
 * Parses the XLSX version of the "W200 - Inventory Report".
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export function parseW200ExcelReport(
  pathToXlsxFile: string
): W200ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 3
  }) as W200ExcelReportResults

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (results.reportName !== w200ReportName) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Invalid reportName: ${results.reportName}`)
  }

  /*
   * Loop through sheets
   */

  debug(`Looping through ${workbook.SheetNames.length} sheets`)

  for (const sheetName of workbook.SheetNames) {
    // eslint-disable-next-line security/detect-object-injection
    const worksheetData = getXLSXWorkSheetData(workbook.Sheets[sheetName])

    /*
     * Loop through rows
     */

    for (const row of worksheetData) {
      if (isStoreroomRow(row)) {
        const storeroomRawText = row[0] ?? ''

        results.data.push({
          storeroom: storeroomRawText
            .slice(11, storeroomRawText.indexOf(' - '))
            .trim(),
          storeroomDescription: storeroomRawText
            .slice(storeroomRawText.indexOf(' - ') + 3)
            .trim(),
          items: []
        })
      } else if (isDataRow(row)) {
        results.data.at(-1)?.items.push({
          itemNumber: row[0] ?? '',
          itemName: row[1] ?? '',
          binLocation: row[3] ?? '',
          quantityInStock: Number.parseFloat(row[4] ?? ''),
          reservedQuantity: Number.parseFloat(row[6] ?? ''),
          unacceptedTransferQuantity: Number.parseFloat(row[7] ?? ''),
          unshippedRetIssQuantity: Number.parseFloat(row[8] ?? ''),
          unshippedRetInvQuantity: Number.parseFloat(row[9] ?? ''),
          averageTrueCost: Number.parseFloat(row[10] ?? ''),
          defaultMarkup: Number.parseFloat(row[12] ?? ''),
          averageTrueCostWithMarkup: Number.parseFloat(row[13] ?? ''),
          stockExtValue: Number.parseFloat(row[14] ?? ''),
          stockExtValueWithMarkup: Number.parseFloat(row[16] ?? '')
        })
      } else {
        debug(row)
      }
    }
  }

  return results
}
