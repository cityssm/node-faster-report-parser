# FASTER Web Report Parser

[![npm (scoped)](https://img.shields.io/npm/v/%40cityssm/faster-report-parser)](https://www.npmjs.com/package/@cityssm/faster-report-parser)
[![DeepSource](https://app.deepsource.com/gh/cityssm/node-faster-report-parser.svg/?label=active+issues&show_trend=true&token=rD0jxkWVmFU_1JBnPdo6HdKI)](https://app.deepsource.com/gh/cityssm/node-faster-report-parser/)
[![Maintainability](https://api.codeclimate.com/v1/badges/6e4f094e9e2473b3463b/maintainability)](https://codeclimate.com/github/cityssm/node-faster-report-parser/maintainability)

**Parses select Excel and CSV reports from the
[FASTER Web](https://fasterasset.com/products/fleet-management-software/) Fleet Management System
into usable data objects.**

It includes support for two main FASTER Web report types.

- **Select "Standard" CSV reports**,
  mostly associated with inventory.
  Includes:

  - W200S - Inventory Summary Report
  - W223 - Inventory Transaction Details Report
  - W235 - Inventory Snapshot
  - W600 - Pick List Values Report

- **Select "Standard" XLSX reports**,
  mostly associated with inventory.
  Includes:

  - W200 - Inventory Report
  - W217 - Direct Charge Transactions
  - W223 - Inventory Transaction Details Report

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

## More Code for FASTER Web

[Userscripts for FASTER Web](https://cityssm.github.io/userscripts/#userscripts-for-faster-web)<br />
Fixes some of the common irks when using FASTER Web.
