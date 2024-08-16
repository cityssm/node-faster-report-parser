import type { ParseFasterCsvReportOptions } from '../csvTypes.js'

const w600ColumnReturnNames = {
  textbox4: 'tableName',
  textbox5: 'code',
  textbox6: 'codeDescription'
} as const

export type W600ReportRow = Record<
  (typeof w600ColumnReturnNames)[keyof typeof w600ColumnReturnNames],
  string
>

/**
 * W600 - Pick List Values Report
 */
export const w600: ParseFasterCsvReportOptions<W600ReportRow> = {
  columnReturnNames: w600ColumnReturnNames,
  columnParameterReturnNames: {
    Textbox40: 'timeZone',
    textbox19: 'tableName',
    textbox25: 'includeObsoleteCodes'
  },
  columnVersionReturnNames: {
    textbox28: 'script'
  }
}
