This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter project.

## How to debug

This branch is for debug purposes. It contains additional config for debugging the app locally. Both next.config.js and tsconfig.json contain additional settings for debugging.

Before debugging make sure to clone the asssistant-ui repo and install its dependencies and both this repo and the assistant-ui repo are placed in the same parent directory.

## Leveraging ExternalStoreRuntime to connect to SmartVision API

https://www.assistant-ui.com/docs/runtimes/custom/external-store

## Getting Started

First, add your OpenAI API key to `.env.local` file:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
