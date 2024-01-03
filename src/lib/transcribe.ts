import whisper from "whisper-node-ts";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export class Transcriber {
  private filename: string;
  private script: string;

  constructor(filename: string) {
    const fileExists = this.doesFileExist(filename);
    if (!fileExists) throw new Error("File does not exist");

    this.filename = filename;
    this.script = "";
  }

  async doesFileExist(filename: string): Promise<boolean> {
    try {
      await fs.promises.access(filename, fs.constants.F_OK);
      return true;
    } catch (err) {
      console.log(chalk.red("Error accessing file"));
      return false;
    }
  }

  async transcribe() {
    console.log(
      chalk.yellow(`\nTranscribing ${path.basename(this.filename)}...`)
    );
    const transcript = await whisper.whisper(this.filename);
    this.script = transcript.map((line) => line.speech).join("\n");
  }

  getScript() {
    return this.script;
  }

  async saveScript(filename: string) {
    try {
      console.log(chalk.yellow("\nSaving script..."));
      const _path = path.join(__dirname, filename);
      await fs.promises.writeFile(_path, this.script);
    } catch (err) {
      console.log(chalk.red("Error saving script"));
      console.error(err);
    }
  }
}
