import type { ParseFasterCsvReportOptions } from '../csvTypes.js'

const w603ColumnReturnNames = {
  Textbox4: 'messageId',
  Textbox5: 'messageDateTime',
  Textbox14: 'messageType',
  Textbox15: 'message',
  Textbox129: 'exceptionDetails'
} as const

export type W603ReportRow = Record<
  (typeof w603ColumnReturnNames)[keyof typeof w603ColumnReturnNames],
  string
>

/**
 * W600 - Pick List Values Report
 */
export const w603: ParseFasterCsvReportOptions<W603ReportRow> = {
  columnReturnNames: w603ColumnReturnNames,
  columnParameterReturnNames: {
    textbox390: 'timeZone',
    textbox24: 'startDate',
    textbox386: 'endDate',
    textbox388: 'messageType',
    Textbox10: 'applicationType',
    Textbox318: 'displayExceptionDetails'

  },
  columnVersionReturnNames: {
    textbox224: 'script'
  }
}
