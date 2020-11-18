# XRPL-Github-Bot

Post XRPL transaction details on issue/commit comment if a bot find a transaction hash inside the comment body

## Setup

```sh
# Install dependencies
npm install

# Compile
npm run build

# Run
npm run start
```

## Docker

```sh
# 1. Build container
docker build -t XRPL-GitHub-Bot.

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> XRPL-GitHub-Bot
```
