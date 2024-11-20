import { type DateString, dateToString } from '@cityssm/utils-datetime'
import Debug from 'debug'

import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug('faster-report-parser:xlsx:w201')

export interface W201ItemReportData {
  documentNumber: number
  assetNumber?: string
  itemNumber: string
  itemName: string
  issuedDate: DateString
  repairReason: string
  issuedBy: string
  quantity: number
  issuePrice: number
  extendedCost: number
}

export const w201ReportName = 'W201 - Inventory Item Issue Report'

export interface W201ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w201ReportName
  data: W201ItemReportData[]
}

function isDataRow(row: XlsxDataRow): boolean {
  return row.length === 11 && /^\d+$/.test(row[0] ?? '')
}

/**
 * Parses the XLSX version of the "W201 - Inventory Item Issue Report".
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export function parseW201ExcelReport(
  pathToXlsxFile: string
): W201ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 3
  }) as W201ExcelReportResults

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (results.reportName !== w201ReportName) {
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
      if (isDataRow(row)) {
        results.data.push({
          documentNumber: Number.parseInt(row[0] ?? ''),
          assetNumber: row[1] === 'No Asset' ? undefined : row[1],
          itemNumber: row[2] ?? '',
          itemName: row[3] ?? '',
          issuedDate: dateToString(new Date(row[4] ?? '')),
          repairReason: row[6] ?? '',
          issuedBy: row[7] ?? '',
          quantity: Number.parseFloat(row[8] ?? ''),
          issuePrice: Number.parseFloat(row[9] ?? ''),
          extendedCost: Number.parseFloat(row[10] ?? '')
        })
      } else {
        debug(row)
      }
    }
  }

  return results
}
