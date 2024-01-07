#! /usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import path from "path";
import * as z from "zod";
import { Command } from "commander";
import fs from "fs";

import { AI } from "@/lib/ai";
import { AudioParser } from "@/lib/audio-parser";

function createAssetsDirectories() {
  const assetsPath = path.join(__dirname, "assets", "output");
  const scriptsPath = path.join(__dirname, "assets", "scripts");

  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath);
  }

  if (!fs.existsSync(scriptsPath)) {
    fs.mkdirSync(scriptsPath);
  }
}

async function main() {
  cliHeader();

  const program = new Command();

  program
    .version("1.0.0")
    .description("A CLI for chatting with audio files using GPT-3")
    .option("-f, --filepath  [value]", "Audio file to transcribe")
    .parse(process.argv);

  const options = program.opts();

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  const rl = readline.createInterface({ input, output });

  if (!options.filepath) {
    console.log(chalk.redBright("Please provide a valid file path"));
    process.exit(1);
  }

  const schema = z.object({
    filepath: z.string(),
  });

  await schema.parseAsync(options);

  createAssetsDirectories();

  const ai = new AI();
  const transcriber = new AudioParser(options.filepath);

  const scriptPath = path.join(
    __dirname,
    "assets",
    "scripts",
    `
    ${transcriber.getFileName()}_script.txt`.trim()
  );

  if (fs.existsSync(scriptPath)) {
    console.log(chalk.yellow("\nCache: Found script...\n"));
  } else {
    console.log(chalk.red("\nCache: Script not found...\n"));
    await transcriber.transcribe();
    await transcriber.save(scriptPath);
  }

  await ai.load(scriptPath);

  while (true) {
    const question = await rl.question(chalk.blueBright("\n\nQuestion: "));
    await ai.ask(question);

    if (question === "exit") rl.close();
  }
}

function cliHeader() {
  clear();
  console.log(
    chalk.greenBright(
      figlet.textSync("Speech GPT", { horizontalLayout: "full" })
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
