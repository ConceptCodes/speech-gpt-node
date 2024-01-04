# Speech GPT

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple command-line tool that allows you to chat with your speeches.

## Features
- Speech to text using OpenAI Whisper
- VectorDB for storing speeches

## Prerequisites

- Node v18+
- PNPM v6+
- FFMPEG v4+

## Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/conceptcodes/speech-gpt-node.git
   cd speech-gpt-node
   ```

2. Install the required dependencies:

    ```sh
    pnpm i
    ```

3. Download whisper model of choice

    ```sh
    npx whisper-node download
    ```

4. Grab an API key from [OpenAI](https://beta.openai.com/)

5. Update your env file

    ```sh
    cp .env.example .env
    ```
6. Build the CLI
  
      ```sh
      pnpm build
      ```
6. Install CLI globally
  
      ```sh
      npm i -g
      ```

## Usage
To run the CLI, use the following command:

```sh
speech-gpt --filename=<path-to-file>


  ____                                 _          ____   ____    _____ 
 / ___|   _ __     ___    ___    ___  | |__      / ___| |  _ \  |_   _|
 \___ \  | '_ \   / _ \  / _ \  / __| | '_ \    | |  _  | |_) |   | |  
  ___) | | |_) | |  __/ |  __/ | (__  | | | |   | |_| | |  __/    | |  
 |____/  | .__/   \___|  \___|  \___| |_| |_|    \____| |_|       |_|  
         |_|                                                           

Could not find script from cache...

Found converted wav file from cache...
[whisper-node] Transcribing: <path-to-file>/dead_mall.wav 

Transcription took 4m 44s
Done

Saving script to dead_mall_script.txt

Loading VectorStore...

Saving VectorStore...

Question: how does the narrator feel about nft's?

AI is thinking...

Speech GPT:
The narrator does not explicitly mention their opinion on NFTs in the given context.


Question: are you sure

AI is thinking...

Speech GPT:
There is no explicit mention of the narrator's opinion on NFTs in the given context.


Question: whats does he feel about the metaverse?

AI is thinking...

Speech GPT:
The narrator's opinion on the metaverse is not explicitly stated in the given context. However, they provide critical analysis and skepticism towards the concept, referring to it as a "rhetorical device" and highlighting the vague and incoherent nature of its definitions. They also mention that many people writing about the metaverse are salesmen who may not have considered if it would actually be practical or fulfilling. Therefore, the narrator seems to approach the concept with a degree of skepticism and questioning.


Question: okay what are some key points?

AI is thinking...

Speech GPT:
1. The metaverse is a rhetorical device and not an actual, tangible thing being built.
2. There is no consensus definition of the metaverse, and it can encompass a wide range of ideas, sometimes conflicting with each other.
3. The concept of the metaverse is often rooted in the present political and social values of the writer.
4. The narrator criticizes salesmen who write about the inevitability of the metaverse without considering if it would actually be practical or enjoyable.
5. The metaverse is often associated with virtual reality, but the limitations of VR technology and the human body make it a restrictive experience.
6. Decentraland, a specific project attempting to create a metaverse, is seen by the narrator as a non-starter because it lacks key features like virtual reality.
7. The narrator questions the viability and potential disappointment of the metaverse, suggesting that the future may not live up to the hype and could resemble a "dead mall."
```

## Roadmap
- [ ] Store embeddings in local postgres DB
- [ ] Add a cache for files 
- [ ] clean up the CLI
- [ ] Add timestamp sources to the response

