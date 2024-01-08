import whisper from "whisper-node";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";

export class AudioParser {
  private filePath: string;
  private script: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.script = "";
  }

  setScript(script: string) {
    this.script = script;
  }

  getFileName() {
    return path.basename(this.filePath).split(".")[0];
  }

  async convertFileToWav() {
    try {
      console.log(chalk.yellow("\nConverting file to wav..."));

      const output = this.getOutputPath();

      const command = `ffmpeg -i ${this.filePath} -ar 16000 ${output}`;

      exec(command, (error, stdout, _) => {
        if (error) {
          console.log(chalk.red("Error converting file to wav"));
          throw error;
        }
        console.log(stdout);
      });

      this.filePath = output;
      console.log(chalk.green("Done\n"));
    } catch (err) {
      console.log(chalk.red("Error converting file to wav"));
      throw err;
    }
  }

  async transcribe() {
    try {
      if (!fs.existsSync(this.filePath)) throw new Error("File does not exist");

      if (fs.existsSync(this.getOutputPath())) {
        console.log(chalk.yellow("\nFound converted wav file from cache..."));
        this.filePath = this.getOutputPath();
      } else {
        await this.convertFileToWav();
        setTimeout(() => {}, 2000);
      }

      const options = {
        modelName: "tiny.en",
        whisperOptions: {
          word_timestamps: false,
        },
      };

      const start = performance.now();
      const transcript = await whisper(this.filePath, options);
      const end = performance.now();

      console.log(
        chalk.yellow(`\nTranscription took ${this.convertTime(end - start)}`)
      );

      this.script = transcript
        .map(
          (line: { start: number; end: number; speech: string }) => line.speech
        )
        .join("\n");

      console.log(chalk.green("Done"));
    } catch (err) {
      console.log(chalk.red("Error transcribing file"));
      throw err;
    }
  }

  async save(filePath: string) {
    try {
      console.log(
        chalk.yellow(`\nSaving script to ${path.basename(filePath)}`)
      );
      await fs.promises.writeFile(filePath, this.script);
    } catch (err) {
      console.log(chalk.red("Error saving script"));
      throw err;
    }
  }

  getOutputPath() {
    return path.join(
      __dirname,
      "..",
      "assets",
      "output",
      `${this.getFileName()}.wav`
    );
  }

  convertTime(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + "m " + (seconds < 10 ? "0" : "") + seconds + "s";
  }
}
