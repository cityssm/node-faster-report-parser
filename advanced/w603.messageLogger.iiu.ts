import type { W603ReportRow } from '../csvReports.js'

const inventoryImportBlockStartMessagePrefix =
  'Inventory Import process started'
const inventoryImportBlockEndMessagePrefix =
  'Inventory Import process completed'

interface InventoryImportError {
  messageId: number
  messageDateTime: string
  message: string
  fileName?: string
}

/**
 * Filters out the errors that occurred during the Inventory Import process from the W603 CSV report.
 *
 * The data must include at minimum the following filters:
 * - Message Type = 'Information', 'Error'
 * - Application Type = 'Integration'
 *
 * Other data will be ignored.
 * @param messageLoggerData - Data parsed from the W603 CSV report
 * @returns - A list of errors that occurred during the Inventory Import process,
 *            along with the file associated with each error.
 */
export function extractInventoryImportErrors(
  messageLoggerData: W603ReportRow[]
): InventoryImportError[] {
  /*
   * Ensure the data is sorted by the "messageId" column
   */

  messageLoggerData.sort((a, b) => {
    const messageIdA = Number.parseInt(a.messageId === '' ? '0' : a.messageId)
    const messageIdB = Number.parseInt(b.messageId === '' ? '0' : b.messageId)
    return messageIdA - messageIdB
  })

  /*
   * Build error list
   */

  const errorData: InventoryImportError[] = []

  let inventoryImportBlockStartMessageId: number | undefined

  for (const row of messageLoggerData) {
    if (row.messageId === '') {
      continue
    }

    if (row.message.trim().startsWith(inventoryImportBlockStartMessagePrefix)) {
      inventoryImportBlockStartMessageId = Number.parseInt(row.messageId)
    }

    if (row.message.trim().startsWith(inventoryImportBlockEndMessagePrefix)) {
      inventoryImportBlockStartMessageId = undefined
    }

    if (inventoryImportBlockStartMessageId !== undefined) {
      if (row.messageType === 'Error') {
        errorData.push({
          messageId: Number.parseInt(row.messageId),
          messageDateTime: row.messageDateTime,
          message: row.message
        })
      } else if (
        row.messageType === 'Information' &&
        (row.message.includes(' file copied ') ||
          row.message.includes(' file deleted '))
      ) {
        const fileName = row.message
          .slice(0, Math.max(0, row.message.indexOf(' file ')))
          .trim()

        for (let index = errorData.length - 1; index >= 0; index--) {
          if (
            errorData[index].fileName === undefined &&
            errorData[index].messageId > inventoryImportBlockStartMessageId
          ) {
            errorData[index].fileName = fileName
          } else {
            break
          }
        }
      }
    }
  }

  /*
   * Return error list
   */

  return errorData
}
