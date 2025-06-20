export declare const w399ReportName = "W399 - TechnicianWorkOrder";
export interface W399TechnicianWorkOrderXmlResults {
    reportName: typeof w399ReportName;
    workOrderNumber: number;
    workOrderStatus: string;
    dateTimeIn: Date;
    dateTimeOut?: Date;
    asset: {
        assetNumber: string;
        license: string;
        class: string;
        color: string;
        year: number;
        vinSerialNumber: string;
        make: string;
        model: string;
    };
    repairs: Array<{
        maintenanceShop: string;
        repairReason: string;
        repairDescription: string;
        repairStatus: string;
        technician: string;
    }>;
    notes: Array<{
        noteDate: Date;
        noteSubject: string;
        noteText: string;
        noteAuthor: string;
    }>;
}
export declare function parseW399TechnicianWorkOrder(pathToXmlFile: string): Promise<W399TechnicianWorkOrderXmlResults>;
