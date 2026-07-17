import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const plan = JSON.parse(await readFile(new URL("../platform/contracts/v1/verification-plan.json", import.meta.url), "utf8"));
const status = JSON.parse(await readFile(new URL("../platform/contracts/v1/implementation-status.json", import.meta.url), "utf8"));

if (process.argv.includes("--plan")) {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

const contractRun = spawnSync(process.execPath, ["--test", "platform/contracts/v1/tests/platform-contracts.test.mjs"], {
  cwd: new URL("..", import.meta.url),
  encoding: "utf8",
});
process.stdout.write(contractRun.stdout);
process.stderr.write(contractRun.stderr);

const planned = Object.entries(status.gates).filter(([, value]) => value !== "implemented");
if (contractRun.status !== 0 || planned.length > 0) {
  console.error("Textbook verification is intentionally incomplete:");
  for (const [gate, value] of planned) console.error("- " + gate + ": " + value);
  process.exit(1);
}

console.log("All " + plan.gates.length + " textbook verification gates passed.");
