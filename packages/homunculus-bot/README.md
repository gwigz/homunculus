# `@gwigz/homunculus-bot`

Bot framework for creating Second Life bots with chat commands and LSL/SLua communication capabilities.

> [!CAUTION]
>
> This library has not been tested yet, nor is it published yet either.

## Usage

First, create a new bot instance with your client and configuration:

```typescript
import { Bot } from "@gwigz/homunculus-bot"
import { Client } from "@gwigz/homunculus-core"

const client = new Client()

const bot = new Bot(client, {
  commandPrefix: "!",
  apiPrefix: "#api",
  apiSeparator: ",",
  apiChannel: 81513312,
  onError: console.error,
})

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
client.connect()
```

More complete examples can be found in the [`examples`](https://github.com/gwigz/homunculus/tree/main/packages/homunculus-bot/examples) folder.

Also, check out the [quick start](https://homunculus.inworld.link/en/bot/core) guide if you're having trouble.

### Chat Commands

Register commands that respond to local chat messages. Currently, commands only work from local chat, restriction options will be added in future updates.

```typescript
// responds to `!ping`
bot.registerCommand({
  action: "ping",
  process(client, data, { source, fromName }) {
    if (source !== "a2e76fcd-9360-4f6d-a924-000000000003") {
      return
    }

    return `Pong ${fromName}!`
  },
})
```

Responses can be guarded using `source`, which is the `UUID` which sent the message.

## API Handlers

LSL/SLua handlers are registered using the `registerApiHandler` method.

```typescript
// handles i.e. `llOwnerSay("#api,status")`
bot.registerApiHandler({
  action: "status",
  process(client, data, message) {
    // optionally respond over `apiChannel`
    return "OK!"
  },
})
```

This registers a function that responds to `llOwnerSay` messages. These currently work on both rezzed objects and attachments, restriction options are planned for future updates.

### Parameter Validation

We also support [zod](https://zod.dev) validation for API handlers. Here's an example of handling JSON parameters.

```typescript
import { z } from "zod/v4"

// handles i.e. `llOwnerSay("#api,sound," + json)`
bot.registerApiHandler({
  action: "sound",
  async process(client, { key, gain }) {
    await client.nearby.triggerSound(key, gain)
  },
  schema: z.object({
    key: z.string().uuid(),
    gain: z.number().min(0).max(1).default(1),
  }),
  format: "json",
})
```
