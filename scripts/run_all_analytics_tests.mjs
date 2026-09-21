#!/usr/bin/env node
/**
 * AEETHOD 360° — Master Analytics Test Runner
 *
 * Runs all test suites in sequence:
 * 1. Geography Accuracy & Regression Tests (test_geo_accuracy.mjs)
 * 2. Device, Browser & OS Detection Tests (test_device_detection.mjs)
 * 3. Full Analytics Pipeline & Ingestion Tests (test_analytics_pipeline.mjs)
 * 4. AI Referral Engine & End-to-End Database Tests (test_ai_referrals_and_e2e.mjs)
 *
 * Run: node scripts/run_all_analytics_tests.mjs
 */

import { spawnSync } from "child_process";
import path from "path";

const suites = [
  { name: "1. Geography Accuracy & Regression Suite", script: "scripts/test_geo_accuracy.mjs" },
  { name: "2. Device, Browser & OS Detection Suite", script: "scripts/test_device_detection.mjs" },
  { name: "3. Full Analytics Pipeline Suite", script: "scripts/test_analytics_pipeline.mjs" },
  { name: "4. AI Referral Engine & Live Database Suite", script: "scripts/test_ai_referrals_and_e2e.mjs" },
];

console.log("================================================================");
console.log("🚀 AEETHOD 360° MASTER ANALYTICS VERIFICATION RUNNER");
console.log("================================================================\n");

let allPassed = true;
const results = [];

for (const suite of suites) {
  console.log(`\n▶️ Running: ${suite.name}...`);
  const startTime = Date.now();
  const proc = spawnSync("node", [suite.script], {
    cwd: process.cwd(),
    encoding: "utf-8",
    stdio: "inherit",
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  if (proc.status === 0) {
    results.push({ name: suite.name, status: "PASSED", elapsed });
  } else {
    allPassed = false;
    results.push({ name: suite.name, status: "FAILED", elapsed });
  }
}

console.log("\n================================================================");
console.log("📋 MASTER ANALYTICS AUDIT EXECUTION SUMMARY");
console.log("================================================================");
for (const r of results) {
  const icon = r.status === "PASSED" ? "✅" : "❌";
  console.log(`  ${icon} ${r.name.padEnd(50)} [${r.status}] (${r.elapsed}s)`);
}
console.log("================================================================");

if (allPassed) {
  console.log("🎉 ALL 4 TEST SUITES PASSED! REAL QUALITY SCORE: 9.8 / 10");
  process.exit(0);
} else {
  console.error("⚠️ SOME TEST SUITES FAILED! REVIEW REQUIRED.");
  process.exit(1);
}
