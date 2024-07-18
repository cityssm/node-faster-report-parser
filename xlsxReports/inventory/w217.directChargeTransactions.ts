import { type DateString, dateToString } from '@cityssm/utils-datetime'
import Debug from 'debug'

import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug('faster-report-parser:xlsx:w217')

export interface W217DocumentReportData {
  documentNumber: number
  contact: string
  documentStatus: string
  symptom: string
  shop: string
  transactions: W217TransactionReportData[]
}

export interface W217TransactionReportData {
  storeroom: string
  itemNumber: string
  itemName: string
  technician: string
  repairDescription: string
  transactionDate: DateString
  quantity: number
  cost: number
}

export const w217ReportName = 'W217 - Direct Charge Transaction Detail'

export interface W217ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w217ReportName
  data: W217DocumentReportData[]
}

function isDocumentRow(row: XlsxDataRow): boolean {
  return (
    row.length === 10 &&
    (row[2] ?? '').startsWith('DOC #: ') &&
    (row[6] ?? '').startsWith('CONTACT: ') &&
    (row[9] ?? '').startsWith('DOCUMENT STATUS: ')
  )
}

function isSymptomRow(row: XlsxDataRow): boolean {
  return (
    row.length === 13 &&
    // Note there is a space before "SYMPTOM: ", hence "includes()"
    (row[2] ?? '').includes('SYMPTOM: ') &&
    (row[6] ?? '').startsWith('SHOP: ')
  )
}

function isDataRow(row: XlsxDataRow): boolean {
  return (
    row.length === 13 &&
    // Has a transaction date
    (row[9] ?? '') !== '' &&
    // Has a value in the quantity column
    Number.isFinite(Number.parseFloat(row[11] ?? ''))
  )
}

export function parseW217ExcelReport(
  pathToXlsxFile: string
): W217ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 5
  }) as W217ExcelReportResults

  if (results.reportName !== w217ReportName) {
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

    let directChargeDocument: W217DocumentReportData | undefined

    for (const row of worksheetData) {
      if (isDocumentRow(row)) {
        if (directChargeDocument !== undefined) {
          results.data.push(directChargeDocument)
        }

        // debug(`DOCUMENT ROW: ${JSON.stringify(row)}`)

        directChargeDocument = {
          documentNumber: Number.parseInt((row[2] ?? '').trim().slice(7).trim(), 10),
          contact: (row[6] ?? '').trim().slice(9).trim(),
          documentStatus: (row[9] ?? '').trim().slice(17).trim(),
          symptom: '',
          shop: '',
          transactions: []
        }
      } else if (isSymptomRow(row) && directChargeDocument !== undefined) {
        // debug(`SYMPTOM ROW: ${JSON.stringify(row)}`)

        directChargeDocument.symptom = (row[2] ?? '').trim().slice(8).trim()
        directChargeDocument.shop = (row[6] ?? '').trim().slice(6).trim()
      } else if (isDataRow(row) && directChargeDocument !== undefined) {
        directChargeDocument.transactions.push({
          storeroom: (row[3] ?? '').trim(),
          itemNumber: row[4] ?? '',
          itemName: row[5] ?? '',
          technician: row[6] ?? '',
          repairDescription: row[7] ?? '',
          transactionDate: dateToString(new Date(row[9] ?? '')),
          quantity: Number.parseFloat(row[11] ?? ''),
          cost: Number.parseFloat(row[12] ?? '')
        })
      }
    }

    if (directChargeDocument !== undefined) {
      results.data.push(directChargeDocument)
    }
  }

  return results
}