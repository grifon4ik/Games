#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const envPath = path.join(rootDir, ".env");
const examplePath = path.join(rootDir, ".env.example");

function ensureEnvFile() {
  if (fs.existsSync(envPath)) {
    return;
  }

  if (!fs.existsSync(examplePath)) {
    console.warn("[setup] .env.example not found — skipping .env creation");
    return;
  }

  fs.copyFileSync(examplePath, envPath);
  console.log("[setup] Created .env from .env.example");
}

function loadEnvFile() {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function isPlaceholder(value) {
  if (!value) {
    return true;
  }

  return (
    value.startsWith("YOUR_") ||
    value.includes("_HERE") ||
    value === "your-project-id" ||
    value === "AIzaSy..."
  );
}

function isFirebaseConfigured() {
  return (
    !isPlaceholder(process.env.PROJECT_ID) &&
    !isPlaceholder(process.env.DATABASE_URL)
  );
}

ensureEnvFile();
loadEnvFile();

if (isFirebaseConfigured()) {
  console.log("[setup] Firebase config detected — online high scores enabled");
} else {
  console.log(
    "[setup] Firebase not configured — local in-memory high scores will be used"
  );
  console.log("[setup] Fill .env with Firebase values to enable cloud scores");
}
