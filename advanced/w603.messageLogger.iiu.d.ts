import { type DateString, type TimeString } from '@cityssm/utils-datetime';
import type { W603ReportRow } from '../csvReports.js';
interface InventoryImportError {
    messageId: number;
    messageDateTime: `${DateString} ${TimeString}`;
    message: string;
    fileName?: string;
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
export declare function extractInventoryImportErrors(messageLoggerData: W603ReportRow[]): InventoryImportError[];
export {};
