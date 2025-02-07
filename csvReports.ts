// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable security/detect-object-injection */

import fs from 'node:fs'

import stringToNumeric from '@cityssm/string-to-numeric'
import Papa from 'papaparse'

import type {
  FasterCsvReportResults,
  ParseFasterCsvReportOptions
} from './csvReports/csvTypes.js'
import { w200s } from './csvReports/inventory/w200s.inventorySummary.js'
import { w223 } from './csvReports/inventory/w223.inventoryTransactionDetails.js'
import { w235 } from './csvReports/inventory/w235.inventorySnapshot.js'
import { w600 } from './csvReports/setup/w600.pickListValues.js'
import { w603 } from './csvReports/setup/w603.messageLogger.js'

/**
 * Parses CSV files of Standard FASTER reports.
 * @param pathToCsvFile - Path to a FASTER CSV file.
 * @param parsingOptions - Parsing options, specific to the type of report.
 * @returns - The parsed results.
 */
export async function parseFasterCsvReport<T>(
  pathToCsvFile: string,
  parsingOptions: ParseFasterCsvReportOptions<T>
): Promise<FasterCsvReportResults<T>> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileStream = fs.createReadStream(pathToCsvFile)

  // eslint-disable-next-line promise/avoid-new
  return await new Promise<FasterCsvReportResults<T>>((resolve) => {
    const results: FasterCsvReportResults<T> = {
      data: [],
      parameters: {},
      version: {
        report: '',
        script: ''
      }
    }

    let headerArray: string[] | undefined
    let loadMetadata = true

    Papa.parse<Record<string, string>>(fileStream, {
      step: (row) => {
        const rawRowDataList = row.data as unknown as string[]

        if (headerArray === undefined) {
          headerArray = rawRowDataList
          return
        }

        const rawRowData = Object.fromEntries(
          headerArray.map((key, index) => [key.trim(), rawRowDataList[index]])
        )

        const resultData: Partial<T> = {}

        // Load return values
        for (const [rawColumnName, returnColumnName] of Object.entries(
          parsingOptions.columnReturnNames ?? {}
        )) {
          resultData[returnColumnName as string] = rawRowData[rawColumnName]
        }

        // Load numeric return values
        for (const [rawColumnName, returnColumnName] of Object.entries(
          parsingOptions.columnNumericReturnNames ?? {}
        )) {
          resultData[returnColumnName as string] = stringToNumeric(
            rawRowData[rawColumnName]
          )
        }

        if (loadMetadata) {
          for (const [
            rawParameterColumnName,
            returnParameterColumnName
          ] of Object.entries(
            parsingOptions.columnParameterReturnNames ?? {}
          )) {
            results.parameters[returnParameterColumnName] =
              rawRowData[rawParameterColumnName]
          }

          for (const [
            rawVersionColumnName,
            returnVersionColumnName
          ] of Object.entries(parsingOptions.columnVersionReturnNames ?? {})) {
            results.version[returnVersionColumnName] =
              rawRowData[rawVersionColumnName]
          }
        }

        loadMetadata = false

        results.data.push(resultData as T)
      },
      complete: () => {
        resolve(results)
      }
    })
  })
}

export const fasterCsvReportOptions = {
  /**
   * W200S - Inventory Summary Report
   */
  w200s,

  /**
   * W223 - Inventory Transaction Details Report
   */
  w223,

  /**
   * W235 - Inventory Snapshot
   */
  w235,

  /**
   * W600 - Pick List Values Report
   */
  w600,

  /**
   * W603 - Message Logger
   */
  w603
}

export type SupportedFasterCsvReportName =
  | keyof typeof fasterCsvReportOptions
  | Capitalize<keyof typeof fasterCsvReportOptions>

export type { W200SReportRow } from './csvReports/inventory/w200s.inventorySummary.js'
export type { W223ReportRow } from './csvReports/inventory/w223.inventoryTransactionDetails.js'
export type { W235ReportRow } from './csvReports/inventory/w235.inventorySnapshot.js'
export type { W600ReportRow } from './csvReports/setup/w600.pickListValues.js'
export type { W603ReportRow } from './csvReports/setup/w603.messageLogger.js'
