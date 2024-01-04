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

async function main() {
  cliHeader();

  const program = new Command();

  program
    .version("1.0.0")
    .description("A CLI for chatting with audio files using GPT-3")
    .option("-f, --filename  [value]", "Audio file to transcribe")
    .parse(process.argv);

  const options = program.opts();

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  const rl = readline.createInterface({ input, output });

  if (!options.filename) {
    console.log(chalk.redBright("Please provide an audio file"));
    process.exit(1);
  }

  const schema = z.object({
    filename: z.string().regex(/\.(wav|mp3|mp4)$/i),
  });

  await schema.parseAsync(options);

  const ai = new AI();
  const transcriber = new AudioParser(options.filename);

  const scriptPath = path.join(
    __dirname,
    "assets",
    "scripts",
    `
    ${transcriber.getFileName()}_script.txt`.trim()
  );

  if (fs.existsSync(scriptPath)) {
    console.log(chalk.yellow("\nFound script from cache..."));
  } else {
    console.log(chalk.red("\nCould not find script from cache..."));
    await transcriber.transcribe();
    await transcriber.save(scriptPath);
  }

  await ai.load(scriptPath);

  while (true) {
    const question = await rl.question(chalk.blueBright("Question: "));
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
