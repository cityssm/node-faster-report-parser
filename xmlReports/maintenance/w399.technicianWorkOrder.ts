import fs from 'node:fs/promises'

import xml2js from 'xml2js'

export const w399ReportName = 'W399 - TechnicianWorkOrder'

type ParsedXmlSubreportTable<T> =
  | ''
  | {
      Detail_Collection: {
        Detail: T | T[]
      }
    }

interface ParsedXml {
  Report: {
    Name: string
    table1: {
      textbox178: `WO# ${number}`

      textbox179: `Date/Time In: ${string}`
      txtOutDate: ' ' | `Date/Time Out: ${string}`

      /** Work Order Status */
      textbox204: string

      /** Downtime */
      textbox214: 'No' | 'Yes'

      /** Work Order Opened By */
      textbox192: string
    }

    table4: {
      /** Symptom */
      textbox1: string

      /** Work Order Shop */
      textbox14: string

      textbox48: `ASSET NUMBER: ${string}`
      textbox49: `LICENSE: ${string}`

      /** Asset Color */
      textbox57: string

      /** Asset Class */
      textbox7: string

      /** Asset Year */
      textbox59: `${number}`

      /** Asset VIN / Serial Number */
      textbox61: string

      /** Asset Make */
      textbox63: string

      /** Asset Model */
      textbox66: string

      subreport1: {
        Report: {
          Name: 'W399s - TireDetails'
          table2: ParsedXmlSubreportTable<object>
        }
      }
      
      subreport5: {
        Report: {
          Name: 'W399s - TransmissionDetails'
          table3: ParsedXmlSubreportTable<object>
        }
      }

      subreport10: {
        Report: {
          Name: 'W399s - FuelDetails'
          table2: ParsedXmlSubreportTable<object>
        }
      }

      subreport2: {
        Report: {
          Name: 'W399s - EngineDetails'
          table2: ParsedXmlSubreportTable<object>
        }
      }
    }

    table2: {
      subreport3: {
        Report: {
          Name: 'W399s - MeterDetails'
          table3: ParsedXmlSubreportTable<object>
        }
      }
      subreport4: {
        Report: {
          Name: 'W399s - PMSAServiceDetails'
          table4: ParsedXmlSubreportTable<object>
        }
      }
      subreport6: {
        Report: {
          Name: 'W399s - WarrantyDetails'
          table5: ParsedXmlSubreportTable<object>
        }
      }
      subreport7: {
        Report: {
          Name: 'W399s - RepairDetails'
          table4: ParsedXmlSubreportTable<{
            /** Maintenance Shop */
            textbox1: string

            RepairReason: string

            /** Repair Description */
            textbox63: `${string} / ${string} / ${string} [${number}]`

            /** Repair Status */
            textbox66: string

            /** Technician */
            textbox73: string
          }>
        }
      }
      subreport8: {
        Report: {
          Name: 'W399s - NoteDetails'
          table4: ParsedXmlSubreportTable<{
            /** Note Date */
            textbox5: string

            /** Note Subject */
            textbox64: string

            NoteText: string

            /** Note Author */
            textbox74: string
          }>
        }
      }
      subreport9: {
        Report: {
          Name: 'W399s - PartsDetails'
          table4: ParsedXmlSubreportTable<{
            /** Part Number */
            textbox1: string
          }>
        }
      }
    }
  }
}

export interface W399TechnicianWorkOrderXmlResults {
  reportName: typeof w399ReportName
  workOrderNumber: number
  workOrderStatus: string
  dateTimeIn: Date
  dateTimeOut?: Date

  asset: {
    assetNumber: string
    license: string
    class: string
    color: string
    year: number
    vinSerialNumber: string
    make: string
    model: string
  }

  repairs: Array<{
    maintenanceShop: string
    repairReason: string

    repairDescription: string

    repairStatus: string

    technician: string
  }>

  notes: Array<{
    noteDate: Date
    noteSubject: string
    noteText: string
    noteAuthor: string
  }>
}

const xmlParser = new xml2js.Parser({
  explicitArray: false,
  mergeAttrs: true,
  trim: true
})

export async function parseW399TechnicianWorkOrder(
  pathToXmlFile: string
): Promise<W399TechnicianWorkOrderXmlResults> {
  const xmlString = await fs.readFile(pathToXmlFile, 'utf8')

  const xml = (await xmlParser.parseStringPromise(xmlString)) as ParsedXml

  if (xml.Report.Name !== w399ReportName) {
    throw new Error(`Invalid report name: ${xml.Report.Name}`)
  }

  const workOrder: Partial<W399TechnicianWorkOrderXmlResults> = {
    reportName: w399ReportName,
    workOrderNumber: Number.parseInt(
      xml.Report.table1.textbox178.replace('WO# ', ''),
      10
    ),
    workOrderStatus: xml.Report.table1.textbox204,

    dateTimeIn: new Date(
      xml.Report.table1.textbox179.replace('Date/Time In: ', '')
    ),
    dateTimeOut:
      xml.Report.table1.txtOutDate.trim() === ''
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
  }

  /*
   * Process the repair details
   */

  const repairDetails = normalizeDetailCollection(
    xml.Report.table2.subreport7.Report.table4
  )

  workOrder.repairs = repairDetails.map((detail) => ({
    maintenanceShop: detail.textbox1,
    repairReason: detail.RepairReason,
    repairDescription: detail.textbox63,
    repairStatus: detail.textbox66,
    technician: detail.textbox73
  }))

  /*
   * Process the note details
   */

  const noteDetails = normalizeDetailCollection(
    xml.Report.table2.subreport8.Report.table4
  )

  workOrder.notes = noteDetails.map((detail) => ({
    noteDate: new Date(detail.textbox5),
    noteSubject: detail.textbox64,
    noteText: detail.NoteText,
    noteAuthor: detail.textbox74
  }))

  /*
   * Return the work order results
   */

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return workOrder as W399TechnicianWorkOrderXmlResults
}

function normalizeDetailCollection<T>(
  detailCollection: ParsedXmlSubreportTable<T>
): T[] {
  if (detailCollection === '') {
    return []
  }

  if (Array.isArray(detailCollection.Detail_Collection.Detail)) {
    return detailCollection.Detail_Collection.Detail
  }

  if (typeof detailCollection.Detail_Collection.Detail === 'object') {
    return [detailCollection.Detail_Collection.Detail as T]
  }

  throw new Error(
    `Invalid Detail_Collection: ${JSON.stringify(detailCollection)}`
  )
}
