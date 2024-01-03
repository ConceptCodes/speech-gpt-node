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
import { Document } from "langchain/dist/document";
import chalk from "chalk";

import { env } from "@/lib/env";

export class AI {
  private model: ChatOpenAI;
  private docs: Document[];

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: env.OPEN_AI_API_KEY,
      verbose: env.NODE_ENV != "production",
    });
    this.docs = [];
  }

  async load(filename: string): Promise<void> {
    const loader = new TextLoader(filename);
    this.docs = await loader.load();
  }

  async ask(question: string): Promise<void> {
    console.log(chalk.blueBright(`Question: ${question}`));

    const vectorStore = await HNSWLib.fromDocuments(
      this.docs,
      new OpenAIEmbeddings()
    );
    const retriever = vectorStore.asRetriever();

    const prompt =
      PromptTemplate.fromTemplate(`Answer the question based only on the following context:
        {context}

        Question: {question}`);

    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);

    console.log(chalk.yellow("AI is thinking..."));

    const result = await chain.invoke(question);

    console.log(chalk.blueBright(`Speech GPT: ${result}`));
  }
}
