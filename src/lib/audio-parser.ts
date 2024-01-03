import whisper from "whisper-node";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";

export class AudioParser {
  private filePath: string;
  private script: string;
  private fileName: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.script = "";
    this.fileName = path.basename(this.filePath).split(".")[0];
  }

  async convertFileToWav() {
    try {
      console.log(chalk.yellow("\nConverting file to wav..."));

      const output = path.join(
        __dirname,
        "..",
        "assets",
        "output",
        `${new Date().getTime() + Math.floor(Math.random() * 1000)}_${
          this.fileName
        }.wav`
      );

      const command = `ffmpeg -i ${this.filePath} -ar 16000 ${output}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(chalk.red("Error converting file to wav"));
          throw error;
        }
        console.log(stdout);
      });

      this.filePath = output;
      console.log(chalk.green("File converted to wav\n"));
    } catch (err) {
      console.log(chalk.red("Error converting file to wav"));
      throw err;
    }
  }

  async transcribe() {
    try {
      if (!fs.existsSync(this.filePath)) throw new Error("File does not exist");

      await this.convertFileToWav();

      const options = {
        modelName: "base.en",
        whisperOptions: {
          word_timestamps: false,
        },
      };

      const transcript = await whisper(this.filePath, options);

      this.script = transcript
        .map(
          (line: { start: number; end: number; speech: string }) => line.speech
        )
        .join("\n");

      console.log(chalk.green("Transcription complete"));
    } catch (err) {
      console.log(chalk.red("Error transcribing file"));
      throw err;
    }
  }

  getFileName() {
    return this.fileName;
  }

  async saveScript(filePath: string) {
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
}
