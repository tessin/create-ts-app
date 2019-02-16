#!/usr/bin/env node

import fs = require("fs");

import { resolve, join } from "path";
import { spawnSync } from "child_process";

const argv = process.argv.slice(2);

if (!(0 < argv.length)) {
  console.error(`usage:\n  yarn create @tessin/ts-app <dirname>`);
  process.exit(1);
}

const dir = resolve(argv[0]);

fs.mkdirSync(dir);

// ================
// init

spawnSync("yarn init -y && yarn add -D typescript @types/node", {
  shell: true,
  cwd: dir,
  stdio: "inherit"
});

// ================
// package.json

type PackageJson = {
  name: string;
  version: string;
  main: string;
  license: string;
  devDependencies: {
    [key: string]: string;
  };
  scripts?: {
    [key: string]: string;
  };
  files?: string[];
};

const packageJsonFilename = join(dir, "package.json");

const packageJson = JSON.parse(
  fs.readFileSync(packageJsonFilename, "utf8")
) as PackageJson;

packageJson.main = "./lib/index.js";

packageJson.scripts = {
  start: "tsc -d -w",
  build: "tsc -d",
  prepublishOnly: "yarn build"
};

packageJson.files = ["lib/"];

fs.writeFileSync(packageJsonFilename, JSON.stringify(packageJson, null, 2));

// ================
// tsconfig.json

const tsconfigJson = fs.readFileSync(
  join(__dirname, "../tsconfig.json"),
  "utf8"
);

fs.writeFileSync(join(dir, "tsconfig.json"), tsconfigJson);

// ================
// .gitignore

const gitignore: string[] = ["lib", "", "node_modules", "", "*.log"];

fs.writeFileSync(join(dir, ".gitignore"), gitignore.join("\n"));

// ================
// .prettierrc.json

const prettierrc = {
  semi: false
};

fs.writeFileSync(
  join(dir, ".prettierrc.json"),
  JSON.stringify(prettierrc, null, 2)
);

// ================
// index.ts

fs.mkdirSync(join(dir, "src"));
fs.writeFileSync(join(dir, "src", "index.ts"), "");
