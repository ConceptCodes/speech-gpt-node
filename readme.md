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
      pnpm i -g
      ```

## Usage
To run the CLI, use the following command:

```sh
speech-gpt --filename=<path-to-file>
```

## Roadmap
- [ ] Store embeddings in local postgres DB
- [ ] Add a cache for files 
- [ ] clean up the CLI

