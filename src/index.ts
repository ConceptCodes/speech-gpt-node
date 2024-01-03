import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import { parseArgs } from "zod-args";
// import pjson from "pjson";
import z from "zod";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { AI } from "@/lib/ai";
import { Transcriber } from "@/lib/transcribe";

async function main() {
  cliHeader();

  const args = parseArgs({
    filename: z.string().regex(/\.(mp3|wav)$/),
  });

  const rl = readline.createInterface({ input, output });

  const ai = new AI();
  const transcriber = new Transcriber(args.filename);

  await transcriber.transcribe();
  await transcriber.saveScript("script.txt");

  ai.load("script.txt");

  while (true) {
    const question = await rl.question("You: ");
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
  // console.log(chalk.blue("     Author: ") + chalk.green(pjson.author));
  // console.log(chalk.blue("    Version: ") + chalk.green(pjson.version));
  // console.log(chalk.blue("    License: ") + chalk.green(pjson.license));
  // console.log(
  //   chalk.blue("Description: ") + chalk.green(pjson.description) + "\n"
  // );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
