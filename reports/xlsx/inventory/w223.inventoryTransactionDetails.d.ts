import { type DateString, type TimeString } from '@cityssm/utils-datetime';
import type { FasterExcelReportResults } from '../xlsxTypes.js';
type TransactionTypeDetails = {
    transactionType: 'RECEIVED';
    transactionDetails: '' | `INVOICE #: ${string}` | `PACKING SLIP #: ${string}` | string;
} | {
    transactionType: 'TRANSFER ACCEPTED' | 'TRANSFER OUT' | 'TRANSFER REJECTED';
    transactionDetails: `FROM STRM: ${string} TO STRM: ${string}` | string;
} | {
    transactionType: 'RETURN TO VENDOR';
    transactionDetails: `FROM STRM: ${string} TO VEN: ${number}` | `FROM DOC ISSUE: ${number} TO VEN: ${number}` | string;
} | {
    transactionType: 'RETURN BIN';
    transactionDetails: `FROM DOC ISSUE: ${number} TO VEN: ${number}` | '' | string;
    documentNumber?: number;
    vendorNumber?: number;
} | {
    transactionType: 'DC ISSUE' | 'WO ISSUE';
    transactionDetails: `DOCUMENT #: ${number}` | string;
    documentNumber?: number;
} | {
    transactionType: 'RETURN TO INV';
    transactionDetails: `FROM DC ISSUE: ${number}` | `FROM WO ISSUE: ${number}` | `TRANSFER FROM STRM: ${string} TO STRM: ${string}` | string;
    documentNumber?: number;
} | {
    transactionType: 'INV ADJUSTMENT';
    transactionDetails: `OLD QTY: ${number}  NEW QTY: ${number}` | string;
} | {
    transactionType: 'DELETED RECEIPT' | 'WORKORDER RESERVE' | 'WORKORDER RELEASE' | 'OTHER';
    transactionDetails: '' | string;
};
export interface W223StoreroomReportData {
    storeroom: string;
    storeroomDescription: string;
    transactions: W223TransactionReportData[];
}
export type W223TransactionReportData = TransactionTypeDetails & {
    itemNumber: string;
    itemName: string;
    transactionDateTime: `${DateString} ${TimeString}`;
    transactionType: string;
    transactionDetails: string;
    quantity: number;
    unitTrueCost: number;
    extCost: number;
    createdDateTime: `${DateString} ${TimeString}`;
    modifiedDateTime: `${DateString} ${TimeString}`;
};
export declare const w223ReportName = "W223 - Inventory Transaction Details Report";
export interface W223ExcelReportResults extends FasterExcelReportResults {
    reportName: typeof w223ReportName;
    data: W223StoreroomReportData[];
}
export declare function parseW223ExcelReport(pathToXlsxFile: string, options?: {
    /**
     * Inverse the signs on the quantity and cost values, making "ISSUE" records positive.
     */
    inverseAmounts?: boolean;
}): W223ExcelReportResults;
export {};
