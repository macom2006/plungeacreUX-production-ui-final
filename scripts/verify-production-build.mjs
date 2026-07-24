import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const fixtureMarkers = [
  "Parker Morgan",
  "Dr. Rowan Vale",
  "REQ-2026-1048",
  "fictional patient account",
];

async function listBundleFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listBundleFiles(path) : [path];
  }));

  return files.flat();
}

const bundleFiles = (await listBundleFiles("dist"))
  .filter((path) => [".html", ".js"].includes(extname(path)));

const findings = [];

for (const path of bundleFiles) {
  const contents = await readFile(path, "utf8");

  for (const marker of fixtureMarkers) {
    if (contents.includes(marker)) {
      findings.push(`${path}: ${marker}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Production bundle contains development fixture data:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.log("Production bundle contains no patient fixture markers.");
}
