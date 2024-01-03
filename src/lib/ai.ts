import { TextLoader } from "langchain/document_loaders/fs/text";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import chalk from "chalk";

import { env } from "@/lib/env";

export class AI {
  private model: ChatOpenAI;
  private vectorStore: any;

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: env.OPEN_AI_API_KEY,
      verbose: env.NODE_ENV != "production",
    });
    this.vectorStore = null;
  }

  async load(filename: string): Promise<void> {
    console.log(chalk.yellow("\nLoading VectorStore..."));
    const loader = new TextLoader(filename);
    const docs = await loader.load();
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: env.OPEN_AI_API_KEY,
        verbose: env.NODE_ENV != "production",
      })
    );
    this.vectorStore = vectorStore.asRetriever();
  }

  async ask(question: string): Promise<void> {
    const prompt =
      PromptTemplate.fromTemplate(`Answer the question based only on the following context:
        {context}

        Question: {question}`);

    const chain = RunnableSequence.from([
      {
        context: this.vectorStore.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    console.log(chalk.yellow("\nAI is thinking..."));

    const result = await chain.invoke(question);

    console.log(chalk.blueBright(`\nSpeech GPT: ${result}`));
  }
}
