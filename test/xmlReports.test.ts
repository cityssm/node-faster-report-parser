// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable no-console, no-secrets/no-secrets */

import assert from 'node:assert'
import { describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES } from '../debug.config.js'
import { parseW399TechnicianWorkOrder, w399ReportName } from '../xmlReports.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

await describe('node-faster-report-parser/xml', async () => {
  await it('Parses "W399 - Technician Work Order"', async () => {
    const results = await parseW399TechnicianWorkOrder(
      './samples/w399_technicianWorkOrder.xml'
    )

    console.log(results)

    assert.strictEqual(results.reportName, w399ReportName)
  })
})
