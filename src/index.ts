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
import { downloadYoutubeVideo, extractVideoId } from "@/lib/utils";

async function main() {
  cliHeader();

  const program = new Command();

  program
    .version("1.0.0")
    .description("A CLI for chatting with audio files using GPT-4")
    .option("-f, --filepath  [value]", "Audio file to transcribe")
    .option("-y, --youtube  [value]", "Youtube video to transcribe")
    .parse(process.argv);

  const options = program.opts();

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }

  const rl = readline.createInterface({ input, output });

  if (!options.filepath && !options.youtube) {
    console.log(chalk.redBright("Please provide an audio file!"));
    process.exit(1);
  }

  const schema = z.object({
    filepath: z.string().optional(),
    youtube: z.string().url().optional(),
  });

  await schema.parseAsync(options);

  const ai = new AI();
  const transcriber = new AudioParser(
    options.filepath || extractVideoId(options.youtube)
  );

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
    if (options.youtube) {
      console.log(chalk.yellow("\nDownloading youtube video..."));
      const script = await downloadYoutubeVideo(options.youtube);
      transcriber.setScript(script);
    } else {
      await transcriber.transcribe();
    }
    await transcriber.save(scriptPath);
    console.log(chalk.green("Done\n"));
  }

  await ai.load(scriptPath);

  while (true) {
    const question = await rl.question(chalk.blueBright("Question: "));
    if (question === "exit") {
      rl.close();
      console.log(chalk.greenBright("\nBye!"));
      process.exit(0);
    }
    await ai.ask(question);
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
