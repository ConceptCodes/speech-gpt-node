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

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

export class AI {
  private model: ChatOpenAI;
  private vectorStore: any;
  private questionTemplate: string;
  private answerTemplate: string;
  private chatHistory: [string, string][];

  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: env.OPEN_AI_API_KEY,
      verbose: env.NODE_ENV != "production",
    });
    this.vectorStore = null;
    this.questionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
      Chat History:
      {chat_history}
      Follow Up Input: {question}
      Standalone question:
    `;

    this.answerTemplate = `Answer the question based only on the following context:
      {context}

      Question: {question}
     `;
    this.chatHistory = [];
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

  private formatChatHistory(chatHistory: [string, string][]) {
    const formattedDialogueTurns = chatHistory.map(
      (dialogueTurn) =>
        `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    );
    return formattedDialogueTurns.join("\n");
  }

  async ask(question: string): Promise<void> {
    const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
      this.questionTemplate
    );

    const ANSWER_PROMPT = PromptTemplate.fromTemplate(this.answerTemplate);

    const standaloneQuestionChain = RunnableSequence.from([
      {
        question: (input: ConversationalRetrievalQAChainInput) =>
          input.question,
        chat_history: (input: ConversationalRetrievalQAChainInput) =>
          this.formatChatHistory(input.chat_history),
      },
      CONDENSE_QUESTION_PROMPT,
      this.model,
      new StringOutputParser(),
    ]);

    const answerChain = RunnableSequence.from([
      {
        context: this.vectorStore.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      ANSWER_PROMPT,
      this.model,
    ]);

    const conversationalRetrievalQAChain =
      standaloneQuestionChain.pipe(answerChain);

    console.log(chalk.yellow("\nAI is thinking..."));

    const result = await conversationalRetrievalQAChain.invoke({
      question: question,
      chat_history: this.chatHistory,
    });

    this.chatHistory.push([question, result.content as string]);

    console.log(chalk.blueBright(`\nSpeech GPT: ${result.content}`));
  }
}
