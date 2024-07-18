export type FasterReportVersion = 'report' | 'script'

export interface FasterReportResults {
  parameters: Record<string, string>
  version: Record<FasterReportVersion, string>
}