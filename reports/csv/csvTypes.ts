import type {
  FasterReportResults,
  FasterReportVersion
} from '../reportTypes.js'

export interface ParseFasterCsvReportOptions<T> {
  columnReturnNames: Record<string, keyof T>
  columnNumericReturnNames?: Record<string, keyof T>
  columnParameterReturnNames?: Record<string, string>
  columnVersionReturnNames?: Record<string, FasterReportVersion>
}

export interface FasterCsvReportResults<T> extends FasterReportResults {
  data: T[]
}
