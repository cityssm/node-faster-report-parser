import assert from 'node:assert';
import { describe, it } from 'node:test';
import { fasterCsvReportOptions, parseFasterCsvReport } from '../csvReports.js';
await describe('node-faster-report-parser/csv', async () => {
    await it('Parses "W200S - Inventory Summary Report"', async () => {
        const results = await parseFasterCsvReport('./samples/w200s.csv', fasterCsvReportOptions.w200s);
        console.log(results.data[0]);
        assert(results.data.length > 0);
        console.log(results.parameters);
        console.log(results.version);
    });
    await it('Parses "W223 - Inventory Transaction Details Report"', async () => {
        const results = await parseFasterCsvReport('./samples/w223.csv', fasterCsvReportOptions.w223);
        console.log(results.data[0]);
        assert(results.data.length > 0);
        console.log(results.parameters);
        console.log(results.version);
    });
    await it('Parses "W235 - Inventory Snapshot"', async () => {
        const results = await parseFasterCsvReport('./samples/w235.csv', fasterCsvReportOptions.w235);
        console.log(results.data[0]);
        assert(results.data.length > 0);
        console.log(results.parameters);
        console.log(results.version);
    });
    await it('Parses "W600 - Pick List Values Report"', async () => {
        const results = await parseFasterCsvReport('./samples/w600.csv', fasterCsvReportOptions.w600);
        console.log(results.data[0]);
        assert(results.data.length > 0);
        console.log(results.parameters);
        console.log(results.version);
    });
});
