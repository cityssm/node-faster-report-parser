# FASTER Web Report Parser

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/faster-report-parser)](https://www.npmjs.com/package/@cityssm/faster-report-parser)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-faster-report-parser.svg/?label=active+issues&show_trend=true&token=rD0jxkWVmFU_1JBnPdo6HdKI)](https://app.deepsource.com/gh/cityssm/node-faster-report-parser/)
[![Maintainability](https://api.codeclimate.com/v1/badges/6e4f094e9e2473b3463b/maintainability)](https://codeclimate.com/github/cityssm/node-faster-report-parser/maintainability)

**Parses select Excel (XLSX) and CSV reports from the
[FASTER Web](https://fasterasset.com/products/fleet-management-software/) Fleet Management System
into usable data objects.**

Useful when developing integrations between FASTER Web and other systems.

## Supported "Standard" FASTER Web Reports

| #     | Report Name                          | CSV | XLSX |
| ----- | ------------------------------------ | --- | ---- |
| W200  | Inventory Report                     |     | ✔️   |
| W200S | Inventory Summary Report             | ✔️  |      |
| W217  | Direct Charge Transactions           |     | ✔️   |
| W223  | Inventory Transaction Details Report | ✔️  | ✔️   |
| W235  | Inventory Snapshot                   | ✔️  |      |
| W600  | Pick List Values Report              | ✔️  |      |

## Important Notes

⚠️ When parsing reports, use the files **as exported** from FASTER Web.<br />
Reports that are opened and resaved in Excel will lose formatting required by the parsers.

⚠️ Excel exports from search results and other tables are **not valid** Excel files.<br />
No parsers can be written for them!

## Installation

```sh
npm install @cityssm/faster-report-parser
```

## Usage

```javascript
import { parseW223ExcelReport } from '@cityssm/faster-report-parser/xlsx'

const parsedReport = parseW223ExcelReport('C:/path/to/report.xlsx')

console.log(parsedReport.data[0].storeroomDescription)
// => "MAIN STOREROOM"
```

## Integration Tips

💡 Schedule exporting the necessary reports in FASTER Web to an FTP, then download those reports for parsing.

- [basic-ftp](https://www.npmjs.com/package/basic-ftp) does a great job downloading from FASTER Web FTP sites!

💡 Schedule downloading reports from the FTP based on the export schedule defined in FASTER Web.

- [node-schedule](https://www.npmjs.com/package/node-schedule) makes it easy to schedule downloading
  new reports using parameters very similar to the scheduling parameters in FASTER Web.

💡 Make use of other APIs and import tools to integrate with other systems.

- [@cityssm/dynamics-gp](https://www.npmjs.com/package/@cityssm/dynamics-gp) - Unofficial integrations with the Microsoft Dynamics GP financial system.

- [@cityssm/worktech-api](https://www.npmjs.com/package/@cityssm/worktech-api) - Unofficial integrations with the WorkTech work order management system.

## More Code for FASTER Web

[FASTER Web Helper](https://github.com/cityssm/faster-web-helper)<br />
A service to support integrations with the FASTER Web fleet management system.

[Userscripts for FASTER Web](https://cityssm.github.io/userscripts/#userscripts-for-faster-web)<br />
Fixes some of the common irks when using FASTER Web.
