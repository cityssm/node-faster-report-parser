import type { DateString, TimeString } from '@cityssm/utils-datetime'

import type { FasterReportResults } from '../reportTypes.js'

export interface FasterExcelReportResults extends FasterReportResults {
  reportName: string
  exportDate: DateString
  exportTime: TimeString
  data: unknown[]
}

export type XlsxDataRow = Array<string | undefined>
