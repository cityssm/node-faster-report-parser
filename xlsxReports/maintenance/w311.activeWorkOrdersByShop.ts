import type { DateString } from '@cityssm/utils-datetime'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from '../../debug.config.js'
import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug(`${DEBUG_NAMESPACE}:xlsx:w311`)

export const w311ReportName = 'W311 - Active Work Orders by Shop'

export interface W311RepairReportData {
  status: string
  technician: string
  repair: string
}

export interface W311WorkOrderReportData {
  workOrderNumber: number
  assetNumber: string
  openedDate: DateString
  daysOpen: number
  status: string
  repairs: W311RepairReportData[]
}

export interface W311ShopReportData {
  shop: string
  shopName: string
  workOrders: W311WorkOrderReportData[]
}

export interface W311ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w311ReportName
  data: W311ShopReportData[]
}

function cleanDelimitedDataField(rawString = ''): string {
  return rawString.slice(rawString.indexOf(':') + 1).trim()
}

function isShopRow(row: XlsxDataRow): boolean {
  return row.length === 10 && (row[0] ?? '').startsWith('WORK ORDER SHOP: ')
}

function isWorkOrderRow(row: XlsxDataRow): boolean {
  return (
    row.length === 10 &&
    row[0] === '' &&
    (row[1] ?? '').startsWith('WORK ORDER: ') &&
    (row[3] ?? '').startsWith('ASSET NUMBER: ')
  )
}

function isRepairHeadingRow(row: XlsxDataRow): boolean {
  return (
    row.length === 10 &&
    row[0] === '' &&
    row[1] === '' &&
    row[2] === 'REPAIR STATUS' &&
    row[3] === 'TECHNICIAN'
  )
}

function isRepairRow(row: XlsxDataRow): boolean {
  return row.length === 7 && (row[2] ?? '') !== ''
}

/**
 * Parses the XLSX version of the "W311 - Active Work Orders by Shop" report.
 * @param pathToXlsxFile - Path to the report.
 * @returns The parsed results.
 */
export function parseW311ExcelReport(
  pathToXlsxFile: string
): W311ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 3
  }) as W311ExcelReportResults

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (results.reportName !== w311ReportName) {
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

    let inRepairRows = false

    for (const row of worksheetData) {
      if (isShopRow(row)) {
        inRepairRows = false

        const shopNumberAndName = cleanDelimitedDataField(row[0])

        const shopNumber = shopNumberAndName
          .slice(0, shopNumberAndName.indexOf('-'))
          .trim()

        const shopName = shopNumberAndName
          .slice(shopNumberAndName.indexOf('-') + 1)
          .trim()

        results.data.push({
          shop: shopNumber,
          shopName,
          workOrders: []
        })
      } else if (isWorkOrderRow(row)) {
        inRepairRows = false
        /*
         * Work Order Number
         */

        const workOrderNumber = cleanDelimitedDataField(row[1])

        /*
         * Asset Number
         */

        const assetNumber = cleanDelimitedDataField(row[3])

        /*
         * Date Opened
         */

        const dateOpenedUnformatted = cleanDelimitedDataField(row[6])

        const dateOpenedSplit = dateOpenedUnformatted.split('/')

        const openedDate =
          `${dateOpenedSplit[2]}-${dateOpenedSplit[0]}-${dateOpenedSplit[1]}` as DateString

        /*
         * Days Open
         */

        const daysOpen = cleanDelimitedDataField(row[7])

        /*
         * Status
         */

        const status = cleanDelimitedDataField(row[9])

        /*
         * Push Record
         */

        results.data.at(-1)?.workOrders.push({
          workOrderNumber: Number.parseInt(workOrderNumber),
          assetNumber,
          openedDate,
          daysOpen: Number.parseInt(daysOpen),
          status,
          repairs: []
        })
      } else if (isRepairHeadingRow(row)) {
        inRepairRows = true
      } else if (inRepairRows && isRepairRow(row)) {
        results.data
          .at(-1)
          ?.workOrders.at(-1)
          ?.repairs.push({
            status: row[2] ?? '',
            technician: (row[3] ?? '').trim(),
            repair: row[6] ?? ''
          })
      }
    }
  }

  return results
}
