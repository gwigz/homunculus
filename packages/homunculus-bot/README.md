# `@gwigz/homunculus-bot`

Bot framework for creating Second Life bots with chat commands and LSL/SLua communication capabilities.

> [!CAUTION]
>
> This library has not been tested yet, nor is it published yet either.

## Usage

First, create a new bot instance with your client and configuration:

```typescript
import { Bot } from "@gwigz/homunculus-bot";
import { Client } from "@gwigz/homunculus-core";

const bot = new Bot(client, {
  commandPrefix: "!",
  apiPrefix: "#api",
  apiSeparator: ",",
  apiChannel: 81513312,
  onError: console.error,
});
```

### Chat Commands

Register commands that respond to local chat messages. Currently, commands only work from local chat, restriction options will be added in future updates.

```typescript
bot.registerCommand({
  action: "ping",
  process: (client, data, message) => {
    if (message.source !== "a2e76fcd-9360-4f6d-a924-000000000003") {
      return;
    }

    // return a message (to local chat)
    return `Pong ${message.fromName}!`;
  },
});
```

### API Handlers

Register API handlers that respond to owner messages. These work on both rezzed objects and attachments, with restriction options planned for future updates.

```typescript
// handles i.e. `llOwnerSay("#api,status")`
bot.registerApiHandler({
  action: "status",
  process: (client, data, message) => {
    // optionally respond over `apiChannel`
    return "OK!";
  },
});
```

### Parameter Validation

The framework supports Zod validation for API handlers. Here's an example of handling JSON parameters:

```typescript
import { z } from "zod/v4";

// handles i.e. `llOwnerSay("#api,sound" + json)`
bot.registerApiHandler({
  action: "sound",
  process: async (client, { key, gain }) => {
    await client.nearby.triggerSound(key, gain);
  },
  schema: z.object({
    key: z.string(),
    gain: z.number().min(0).max(1).default(1),
  }),
  format: "json",
});
```
