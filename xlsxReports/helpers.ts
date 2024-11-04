import fs from 'node:fs'

import { dateToString, dateToTimeString } from '@cityssm/utils-datetime'
import * as XLSX from 'xlsx'

import type { FasterExcelReportResults, XlsxDataRow } from './xlsxTypes.js'

XLSX.set_fs(fs)

/**
 * Returns an XLSX WorkBook object
 * @param pathToXlsxFile - Path to the report
 * @returns XLSX WorkBook object
 */
export function getXLSXWorkBook(pathToXlsxFile: string): XLSX.WorkBook {
  return XLSX.readFile(pathToXlsxFile, { })
}

/**
 * Parses an XLSX WorkSheet into usable data.
 * @param workSheet - An XLSX WorkSheet object.
 * @param formatAsStrings - Set to `true` when dates are included.
 * @returns - The sheet data as strings, array[row][column]
 */
export function getXLSXWorkSheetData(workSheet: XLSX.WorkSheet, formatAsStrings = false): XlsxDataRow[] {
  return XLSX.utils.sheet_to_json(workSheet, {
    header: 1,
    raw: !formatAsStrings
  })
}

function trimRowToData(row: XlsxDataRow): XlsxDataRow {
  while (row.length > 0) {
    if ((row[0] ?? '').trim() === '') {
      row.shift()
    } else {
      break
    }
  }

  return row
}

function parseParameterField(row: XlsxDataRow): {
  fieldName: string
  fieldValue: string
} {
  let fieldName = ''
  let fieldValue = ''

  for (const cell of row) {
    if ((cell ?? '') !== '') {
      if (fieldName === '') {
        fieldName = cell ?? ''
      } else {
        fieldValue = cell ?? ''
        break
      }
    }
  }

  return {
    fieldName: fieldName.slice(0, Math.max(0, fieldName.length - 1)),
    fieldValue
  }
}

interface ExtractReportMetadataOptions {
  /** The first row is 1. */
  reportNameRowNumber: number

  /** The first row is 1. */
  exportDateTimeRowNumber: number
}

/**
 * Extracts the report name, parameters, and versions from the last sheet in the workbook.
 * @param workbook - A FASTER Web Excel report workbook.
 * @param options - Options
 * @returns - An object with the standard Excel results.
 */
export function extractReportMetadata(
  workbook: XLSX.WorkBook,
  options: ExtractReportMetadataOptions
): FasterExcelReportResults {
  const lastSheet = workbook.Sheets[workbook.SheetNames.at(-1) as string]

  const lastSheetRows: XlsxDataRow[] = XLSX.utils.sheet_to_json(lastSheet, {
    header: 1,
    raw: false
  })

  let reportName = ''
  let exportDateTime = ''

  for (const [columnNumber, columnValue] of lastSheetRows[
    options.reportNameRowNumber - 1
  ].entries()) {
    reportName = columnValue ?? ''

    if (reportName !== '') {
      exportDateTime =
        // eslint-disable-next-line security/detect-object-injection
        lastSheetRows[options.exportDateTimeRowNumber - 1][columnNumber] ?? ''
      break
    }
  }

  const exportDateObject = new Date(exportDateTime)

  const results: FasterExcelReportResults = {
    reportName,
    exportDate: dateToString(exportDateObject),
    exportTime: dateToTimeString(exportDateObject),
    parameters: {},
    version: {
      report: '',
      script: ''
    },
    data: []
  }

  let isParametersBlock = false
  let isVersionsBlock = false

  for (const untrimmedRow of lastSheetRows) {
    const row = trimRowToData(untrimmedRow)

    if (row[0]?.startsWith('REPORT PARAMETERS:') ?? false) {
      isParametersBlock = true
    } else if (row[0]?.startsWith('REPORT VERSIONS:') ?? false) {
      isParametersBlock = false
      isVersionsBlock = true
    } else if (isParametersBlock) {
      const parameter = parseParameterField(row)
      if (parameter.fieldName === '') {
        isParametersBlock = false
      } else {
        results.parameters[parameter.fieldName] = parameter.fieldValue
      }
    } else if (isVersionsBlock) {
      const version = parseParameterField(row)
      if (version.fieldName.startsWith('Report')) {
        results.version.report = version.fieldValue
      } else if (version.fieldName.startsWith('Script')) {
        results.version.script = version.fieldValue
      }
    }
  }

  return results
}
