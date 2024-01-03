import whisper from "whisper-node";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { exec } from "child_process";

// TODO: convert mp3 to wav -> ffmpeg -i input.mp3 -ar 16000 output.wav

export class Transcriber {
  private filePath: string;
  private script: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.script = "";
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
          path.basename(this.filePath).split(".")[0]
        }.wav`
      );
      
      const command = `ffmpeg -i ${this.filePath} -ar 16000 ${output}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(chalk.red("Error converting file to wav"));
          console.error(error);
          return;
        }
        console.log(stdout);
      });

      this.filePath = output;
    } catch (err) {
      console.log(chalk.red("Error converting file to wav"));
      console.error(err);
    }
  }

  async transcribe() {
    try {
      if (!fs.existsSync(this.filePath)) throw new Error("File does not exist");

      const options = {
        modelName: "base.en",
      };

      const transcript = await whisper(this.filePath, options);
      this.script = transcript
        .map(
          (line: { start: number; end: number; speech: string }) => line.speech
        )
        .join("\n");
    } catch (err) {
      console.log(chalk.red("Error transcribing file"));
      console.error(err);
      throw err;
    }
  }

  getScript() {
    return this.script;
  }

  async saveScript(filePath: string) {
    try {
      console.log(chalk.yellow("\nSaving script..."));
      const _path = path.join(__dirname, filePath);
      await fs.promises.writeFile(_path, this.script);
    } catch (err) {
      console.log(chalk.red("Error saving script"));
      console.error(err);
      throw err;
    }
  }
}
