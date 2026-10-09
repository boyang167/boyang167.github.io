import {
  access,
  mkdir,
  mkdtemp,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  migrateNotes,
  renderMigrationReport,
  validateMigration,
} from "./lib/note-migration.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

function readOption(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function replaceGeneratedDirectories(replacements) {
  const suffix = `${process.pid}-${Date.now()}`;
  const backups = [];
  const installed = [];
  try {
    for (const { target } of replacements) {
      if (await exists(target)) {
        const backup = `${target}.backup-${suffix}`;
        await rename(target, backup);
        backups.push({ target, backup });
      }
    }
    for (const { staged, target } of replacements) {
      await mkdir(path.dirname(target), { recursive: true });
      await rename(staged, target);
      installed.push(target);
    }
  } catch (error) {
    for (const target of installed.reverse()) {
      await rm(target, { recursive: true, force: true });
    }
    for (const { target, backup } of backups.reverse()) {
      await rename(backup, target);
    }
    throw error;
  }
  await Promise.all(
    backups.map(({ backup }) => rm(backup, { recursive: true, force: true })),
  );
}

const sourceOption = readOption("--source");
if (!sourceOption) {
  console.error(
    "Usage: npm run migrate:notes -- --source <absolute-notes-directory>",
  );
  process.exitCode = 2;
} else {
  const sourceRoot = path.resolve(sourceOption);
  const stagingRoot = await mkdtemp(
    path.join(repositoryRoot, ".note-migration-"),
  );
  const stagedContent = path.join(stagingRoot, "notes");
  const stagedAssets = path.join(stagingRoot, "knowledge-assets");
  const reportPath = path.join(
    repositoryRoot,
    "docs",
    "migration-report.md",
  );

  try {
    await Promise.all([
      mkdir(stagedContent, { recursive: true }),
      mkdir(stagedAssets, { recursive: true }),
      mkdir(path.dirname(reportPath), { recursive: true }),
    ]);
    const report = await migrateNotes({
      sourceRoot,
      contentRoot: stagedContent,
      assetRoot: stagedAssets,
    });
    await writeFile(reportPath, renderMigrationReport(report), "utf8");
    validateMigration(report);
    await replaceGeneratedDirectories([
      {
        staged: stagedContent,
        target: path.join(repositoryRoot, "src", "content", "notes"),
      },
      {
        staged: stagedAssets,
        target: path.join(repositoryRoot, "public", "knowledge-assets"),
      },
    ]);
    console.log(
      `Migrated ${report.migrated.length} documents, excluded ${report.excluded.length}, and materialized ${report.assets.length} assets.`,
    );
    console.log(`Report: ${reportPath}`);
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
}
