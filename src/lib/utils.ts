import { getVideoDetails } from "youtube-caption-extractor";
import chalk from "chalk";

export async function downloadYoutubeVideo(url: string): Promise<string> {
  try {
    const videoID = extractVideoId(url);
    const videoDetails = await getVideoDetails({ videoID, lang: "en" });

    console.log(
      chalk.yellow(`\nDownloading Subtitles:  `) + videoDetails.title
    );

    return videoDetails.subtitles.map((line) => line.text).join("\n");
  } catch (error) {
    console.log(chalk.red("Error downloading video"));
    throw error;
  }
}

export function extractVideoId(url: string): string {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
  const match = regex.exec(url);
  if (!match) throw new Error("Invalid Youtube URL");
  return match[1];
}
