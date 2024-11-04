import {
  type DateString,
  type TimeString,
  dateToString,
  dateToTimeString
} from '@cityssm/utils-datetime'
import Debug from 'debug'

import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug('faster-report-parser:xlsx:w604')

export interface W604MessageReportData {
  messageId: number
  timestampDate: DateString
  timestampTime: TimeString
  logLevel: string
  message: string
  transactionData: string
}

export const w604ReportName = 'W604 - Integration Log Viewer'

export interface W604ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w604ReportName
  data: W604MessageReportData[]
}

function isHeaderRow(row: XlsxDataRow): boolean {
  return row.length === 9 && row[0] === 'MESSAGE ID' && row[1] === 'TIMESTAMP'
}

function isMessageRow(row: XlsxDataRow): boolean {
  return row.length === 8 && row[0] !== ''
}

/**
 * Parses the XLSX version of the "W604 - Integration Log Viewer".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
export function parseW604ExcelReport(
  pathToXlsxFile: string
): W604ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 3
  }) as W604ExcelReportResults

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (results.reportName !== w604ReportName) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Invalid reportName: ${results.reportName}`)
  }

  /*
   * Loop through sheets
   */

  debug(`Looping through ${workbook.SheetNames.length} sheets`)

  for (const sheetName of workbook.SheetNames) {
    // eslint-disable-next-line security/detect-object-injection
    const worksheetData = getXLSXWorkSheetData(workbook.Sheets[sheetName], true)

    /*
     * Loop through rows
     */

    let pastHeaderRow = false

    for (const row of worksheetData) {
      if (pastHeaderRow && isMessageRow(row)) {
        const timestampDate = new Date(row[1] ?? '')

        results.data.push({
          messageId: Number.parseInt(row[0] ?? ''),
          timestampDate: dateToString(timestampDate),
          timestampTime: dateToTimeString(timestampDate),
          logLevel: row[2] ?? '',
          message: row[5] ?? '',
          transactionData: (row[7] ?? '').trim()
        })
      } else if (isHeaderRow(row)) {
        pastHeaderRow = true
      } else {
        debug(row)
      }
    }
  }

  return results
}
