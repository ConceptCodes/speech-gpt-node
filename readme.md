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

Found converted wav file from cache...
[whisper-node] Transcribing: <path-to-file>/phone.wav 

> 
Transcription took 55515 milliseconds
Done

Saving script to phone_script.txt

Loading VectorStore...

Question: Why should i get this phone?

AI is thinking...

Speech GPT: 
Based on the given context, there is no explicit information provided on why someone should purchase the phone. The speaker discusses the lack of significant updates and mentions some new features such as crash detection, satellite connectivity, and a new camera. However, it ultimately depends on individual preferences and needs.


Question: list reasons why i should not get this phone

AI is thinking...

Speech GPT:
Based on the context provided, some possible reasons why you may not want to get this phone are:
1. It is an incremental update and has minimal changes compared to the previous model.
2. The design, button placement, and overall appearance of the phone are the same as the previous model.
3. The display has the same resolution and refresh rate as the previous model.
4. The storage options, battery size, charging speeds, and lightning port are unchanged.
5. The phone uses the same A15 Bionic chip as the previous model, with only a slight improvement in GPU cores.
6. The new features, such as crash detection and satellite connectivity, may not be essential or necessary for everyone.
7. The camera improvements are minimal, and the differences between the photos taken with this phone and the previous model may not be significant.
8. The video stabilization feature may introduce noise and softness in the footage.
9. The phone's incremental updates may not justify the higher price compared to the previous model or other alternatives in the market.


Question: 
```

## Roadmap
- [ ] Store embeddings in local postgres DB
- [ ] Add a cache for files 
- [ ] clean up the CLI
- [ ] Add timestamp sources to the response

