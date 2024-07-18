# FASTER Web Report Parser

Unofficial tools to help with integrations with the
[FASTER Web](https://fasterasset.com/products/fleet-management-software/)
fleet management system.

It includes support for two main FASTER Web report types.

- **Parsers for select "Standard" CSV reports**,
  mostly associated with inventory.
  Includes:

  - W200S - Inventory Summary Report
  - W223 - Inventory Transaction Details Report
  - W235 - Inventory Snapshot
  - W600 - Pick List Values Report

- **Parsers for select "Standard" XLSX reports**,
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

## More Code for FASTER Web

[Userscripts for FASTER Web](https://cityssm.github.io/userscripts/#userscripts-for-faster-web)<br />
Fixes some of the common irks when using FASTER Web.
