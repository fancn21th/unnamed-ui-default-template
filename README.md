# Default Template for Unnamed UI

## 如何调试 aissistant ui 源代码 / How to debug

This branch is for debug purposes. It contains additional config for debugging the app locally. Both next.config.js and tsconfig.json contain additional settings for debugging.

Before debugging make sure to clone the asssistant-ui repo and install its dependencies and both this repo and the assistant-ui repo are placed in the same parent directory.

## 如何定制 / Leveraging ExternalStoreRuntime to connect to SmartVision API

https://www.assistant-ui.com/docs/runtimes/custom/external-store

## 如何开始 / Getting Started

1. Create a `.env` file in the root directory of the project and add the following environment variables:

``` .env
NEXT_PUBLIC_APP_ID=4097
NEXT_PUBLIC_TOKEN=7914e1fd043f4aaabb14ba8fcd5bd58b
NEXT_PUBLIC_SLUG=/aiapp/v6u3qm67jmau
NEXT_PUBLIC_BASE_URL=https://smartvision-dev.digitalchina.com/
```
## 分支管理 / Branching

- design system branch

  design system components of [unnamed-ui](https://github.com/fancn21th/unnamed-ui) integration

- smartvision branch

  connect to SmartVision API

## 哲学 / Philosophy

do less and focus on more important things
