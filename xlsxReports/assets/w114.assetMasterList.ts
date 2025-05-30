import { type DateString, dateToString } from '@cityssm/utils-datetime'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from '../../debug.config.js'
import {
  extractReportMetadata,
  getXLSXWorkBook,
  getXLSXWorkSheetData
} from '../helpers.js'
import type { FasterExcelReportResults, XlsxDataRow } from '../xlsxTypes.js'

const debug = Debug(`${DEBUG_NAMESPACE}:xlsx:w114`)

interface W114AssetMeterReading {
  actualReading: number
  meterType: string
}

export interface W114AssetReportData {
  assetNumber: string
  financialReferenceNumber: string
  year: number
  make: string
  model: string
  vinSerialNumber: string
  licence: string
  assetContact: string
  department: string
  class: string
  meterReadings: W114AssetMeterReading[]
  acquireDate?: DateString
  status: string
  grossVehicleWeight?: number
  usageCode: string
}

export const w114ReportName = 'W114 - Asset Master List'

export interface W114ExcelReportResults extends FasterExcelReportResults {
  reportName: typeof w114ReportName
  data: W114AssetReportData[]
}

function isDataRow(row: XlsxDataRow): boolean {
  return row.length === 21 && Number.isFinite(Number.parseFloat(row[2] ?? ''))
}

/**
 * Parses the XLSX version of the "W114 - Asset Master List".
 * Tested with version "20240603".
 * @param pathToXlsxFile - Path to the report.
 * @returns - The parsed results.
 */
// eslint-disable-next-line complexity
export function parseW114ExcelReport(
  pathToXlsxFile: string
): W114ExcelReportResults {
  const workbook = getXLSXWorkBook(pathToXlsxFile)

  /*
   * Validate workbook
   */

  const results = extractReportMetadata(workbook, {
    reportNameRowNumber: 2,
    exportDateTimeRowNumber: 3
  }) as W114ExcelReportResults

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (results.reportName !== w114ReportName) {
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

    for (const row of worksheetData) {
      if (!isDataRow(row)) {
        continue
      }

      // debug('Data Row: ' + JSON.stringify(row))

      const meterReadings: W114AssetMeterReading[] = []

      const meterTypes = row[13] ?? ''
      const actualReadings = row[14] ?? ''

      const meterTypesSplit = meterTypes.split(',')
      const actualReadingsSplit = actualReadings.split(',')

      for (const [index, meterTypeUntrimmed] of meterTypesSplit.entries()) {
        const meterType = meterTypeUntrimmed.trim()

        if (meterType !== '' && meterType !== 'No Meters') {
          meterReadings.push({
            meterType,
            // eslint-disable-next-line security/detect-object-injection
            actualReading: Number.parseFloat(actualReadingsSplit[index].trim())
          })
        }
      }

      const acquireDate = new Date(row[15] ?? '')

      const asset: W114AssetReportData = {
        assetNumber: row[0]?.trim() ?? '',
        financialReferenceNumber: row[1] ?? '',
        year: Number.parseInt(row[2] ?? ''),
        make: row[4] ?? '',
        model: row[5] ?? '',
        vinSerialNumber: row[6] ?? '',
        licence: row[8] ?? '',
        assetContact: row[9] ?? '',
        department: row[10] ?? '',
        class: row[12] ?? '',
        meterReadings,
        acquireDate:
          (row[15] ?? '') === '' ? undefined : dateToString(acquireDate),
        status: row[16] ?? '',
        usageCode: row[20]?.trim() ?? ''
      }

      const grossVehicleWeight = Number.parseInt(row[17] ?? '')

      if (Number.isFinite(grossVehicleWeight)) {
        asset.grossVehicleWeight = grossVehicleWeight
      }

      results.data.push(asset)
    }
  }

  return results
}
