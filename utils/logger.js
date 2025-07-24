// utils/logger.js
import fs from "fs";
import path from "path";

console.log("✅ Logger initialized");

// Create logs directory if it doesn't exist
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Generate log file path with timestamp (rotating daily)
const logFile = path.join(
  logDir,
  `${new Date().toISOString().slice(0, 10)}.log`
);
const logStream = fs.createWriteStream(logFile, { flags: "a" });

function writeLog(type, ...args) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [${type.toUpperCase()}] ${args.join(" ")}\n`;
  logStream.write(message);
}

// Override console methods
console.log = (...args) => {
  writeLog("log", ...args);
  process.stdout.write(args.join(" ") + "\n");
};

console.error = (...args) => {
  writeLog("error", ...args);
  process.stderr.write(args.join(" ") + "\n");
};

console.warn = (...args) => {
  writeLog("warn", ...args);
  process.stdout.write(args.join(" ") + "\n");
};

console.info = (...args) => {
  writeLog("info", ...args);
  process.stdout.write(args.join(" ") + "\n");
};
