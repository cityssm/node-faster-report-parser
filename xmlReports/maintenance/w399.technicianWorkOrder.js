import fs from 'node:fs/promises';
import xml2js from 'xml2js';
export const w399ReportName = 'W399 - TechnicianWorkOrder';
const xmlParser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true,
    trim: true
});
export async function parseW399TechnicianWorkOrder(pathToXmlFile) {
    const xmlString = await fs.readFile(pathToXmlFile, 'utf8');
    const xml = (await xmlParser.parseStringPromise(xmlString));
    if (xml.Report.Name !== w399ReportName) {
        throw new Error(`Invalid report name: ${xml.Report.Name}`);
    }
    const workOrder = {
        reportName: w399ReportName,
        workOrderNumber: Number.parseInt(xml.Report.table1.textbox178.replace('WO# ', ''), 10),
        workOrderStatus: xml.Report.table1.textbox204,
        dateTimeIn: new Date(xml.Report.table1.textbox179.replace('Date/Time In: ', '')),
        dateTimeOut: xml.Report.table1.txtOutDate.trim() === ''
            ? undefined
            : new Date(xml.Report.table1.txtOutDate.replace('Date/Time Out: ', '')),
        asset: {
            assetNumber: xml.Report.table4.textbox48.replace('ASSET NUMBER: ', ''),
            license: xml.Report.table4.textbox49.replace('LICENSE: ', ''),
            class: xml.Report.table4.textbox7,
            color: xml.Report.table4.textbox57,
            vinSerialNumber: xml.Report.table4.textbox61,
            make: xml.Report.table4.textbox63,
            model: xml.Report.table4.textbox66,
            year: Number.parseInt(xml.Report.table4.textbox59, 10)
        }
    };
    /*
     * Process the repair details
     */
    const repairDetails = normalizeDetailCollection(xml.Report.table2.subreport7.Report.table4);
    workOrder.repairs = repairDetails.map((detail) => ({
        maintenanceShop: detail.textbox1,
        repairReason: detail.RepairReason,
        repairDescription: detail.textbox63,
        repairStatus: detail.textbox66,
        technician: detail.textbox73
    }));
    /*
     * Process the note details
     */
    const noteDetails = normalizeDetailCollection(xml.Report.table2.subreport8.Report.table4);
    workOrder.notes = noteDetails.map((detail) => ({
        noteDate: new Date(detail.textbox5),
        noteSubject: detail.textbox64,
        noteText: detail.NoteText,
        noteAuthor: detail.textbox74
    }));
    /*
     * Return the work order results
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return workOrder;
}
function normalizeDetailCollection(detailCollection) {
    if (detailCollection === '') {
        return [];
    }
    if (Array.isArray(detailCollection.Detail_Collection.Detail)) {
        return detailCollection.Detail_Collection.Detail;
    }
    if (typeof detailCollection.Detail_Collection.Detail === 'object') {
        return [detailCollection.Detail_Collection.Detail];
    }
    throw new Error(`Invalid Detail_Collection: ${JSON.stringify(detailCollection)}`);
}
