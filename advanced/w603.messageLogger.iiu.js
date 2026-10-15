import { dateToString, dateToTimeString } from '@cityssm/utils-datetime';
const inventoryImportBlockStartMessagePrefix = 'Inventory Import process started';
const inventoryImportBlockEndMessagePrefix = 'Inventory Import process completed';
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    return `${dateToString(dateTime)} ${dateToTimeString(dateTime)}`;
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
export function extractInventoryImportErrors(messageLoggerData) {
    /*
     * Ensure the data is sorted by the "messageId" column
     */
    messageLoggerData.sort((a, b) => {
        const messageIdA = Math.trunc(Number(a.messageId === '' ? '0' : a.messageId));
        const messageIdB = Math.trunc(Number(b.messageId === '' ? '0' : b.messageId));
        return messageIdA - messageIdB;
    });
    /*
     * Build error list
     */
    const errorData = [];
    let inventoryImportBlockStartMessageId;
    for (const row of messageLoggerData) {
        if (row.messageId === '') {
            continue;
        }
        if (row.message.trimStart().startsWith(inventoryImportBlockStartMessagePrefix)) {
            inventoryImportBlockStartMessageId = Math.trunc(Number(row.messageId));
        }
        if (row.message.trimStart().startsWith(inventoryImportBlockEndMessagePrefix)) {
            inventoryImportBlockStartMessageId = undefined;
        }
        if (inventoryImportBlockStartMessageId !== undefined) {
            if (row.messageType === 'Error') {
                errorData.push({
                    messageId: Math.trunc(Number(row.messageId)),
                    messageDateTime: formatDateTime(row.messageDateTime),
                    message: row.message
                });
            }
            else if (row.messageType === 'Information' &&
                (row.message.includes(' file copied ') ||
                    row.message.includes(' file deleted '))) {
                const fileName = row.message
                    .slice(0, Math.max(0, row.message.indexOf(' file ')))
                    .trim();
                for (let index = errorData.length - 1; index >= 0; index -= 1) {
                    if (errorData[index].fileName === undefined &&
                        errorData[index].messageId > inventoryImportBlockStartMessageId) {
                        errorData[index].fileName = fileName;
                    }
                    else {
                        // eslint-disable-next-line unicorn/no-break-in-nested-loop
                        break;
                    }
                }
            }
        }
    }
    /*
     * Return error list
     */
    return errorData;
}
