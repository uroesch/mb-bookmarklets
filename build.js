#!/usr/bin/env node

// ----------------------------------------------------------------------------
// Modules
// ----------------------------------------------------------------------------
import fs from "fs";
import path from "path";
import prettier from "prettier";
import uglify from "uglify-js";
import doctrine from "doctrine";
import babel from "@babel/core";
import { Liquid } from "liquidjs";

// ----------------------------------------------------------------------------
// Global Constants
// ----------------------------------------------------------------------------
const SOURCE_DIR = "src";
const BOOKMARKLET_DIR = "bookmarklets";

// ----------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------
function to_bookmarklet_path(file) {
  let basename = path.parse(file).base;
  let target = path.join(BOOKMARKLET_DIR, basename);
  return target;
}

function scaffold() {
  if (!fs.existsSync(BOOKMARKLET_DIR)) {
    fs.mkdirSync(BOOKMARKLET_DIR);
  }
}

function minify() {
  files().forEach((file) => {
    try {
      const code = fs.readFileSync(file, "utf8");
      const minified = "javascript:" + uglify.minify(code).code;
      fs.writeFileSync(to_bookmarklet_path(file), minified);
    } catch (error) {
      console.error(error);
      console.log("Failed to uglify ${file}");
    }
  });
}

function prettify() {
  files().forEach((file) => {
    try {
      const code = fs.readFileSync(file, "utf8");
      const formatted = prettier.format(code, { parser: "babel" });
      fs.writeFileSync(file, formatted);
    } catch (error) {
      console.error(error);
      console.log("Failed to prettify ${file}");
    }
  });
}

function create_readme() {
  let doc_text = [];
  files().forEach((file) => {
    doc_text.push(parse_doc(file));
  });
  const engine = new Liquid({
    root: path.resolve("templates"),
    extname: ".liquid",
  });
  let readme = engine.renderFileSync("README.adoc.liquid", {
    bookmarklets: doc_text,
  });
  fs.writeFileSync("README.adoc", readme);
}

function parse_doc(file) {
  let doc = {};
  let code = fs.readFileSync(file, "utf8");
  let ast = babel.parse(code);
  let header = ast["comments"][0]["value"];
  let parsed = doctrine.parse(header, { unwrap: true });
  doc["title"] = path.parse(file).name;
  doc["code"] = fs.readFileSync(to_bookmarklet_path(file), "utf8");
  parsed["tags"].forEach((item) => {
    doc[item["title"]] = item["description"];
  });
  return doc;
}

function files() {
  let files = [];
  let directories = ["src"];
  directories.forEach((dir) => {
    fs.readdirSync("src").forEach((file) => {
      files.push(path.join(dir, file));
    });
  });
  return files.flat();
}

function build() {
  scaffold();
  prettify();
  minify();
  create_readme();
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
build();
