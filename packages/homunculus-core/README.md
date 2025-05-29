# `@gwigz/homunculus-core`

Node.js framework that allows basic interactions with the virtual world
[Second Life](https://www.secondlife.com), utilizing the official
[Second Life UDP protocol](http://wiki.secondlife.com/wiki/Protocol).

## Features

- Local chat interactions
- Minimal details about nearby objects and avatars
- More to come later...

## Installation

```shell
npm install @gwigz/homunculus-core

# or with Bun (preferred method)
bun add @gwigz/homunculus-core
```

## Usage

```ts
import { Client, Constants } from "@gwigz/homunculus-core"

const client = new Client()

client.nearby.on("chat", (chat) => {
  if (
    chat.chatType === Constants.ChatTypes.NORMAL &&
    chat.sourceType === Constants.ChatSources.AGENT
  ) {
    if (chat.message.includes("ping")) {
      client.nearby.message("pong")
    }

    console.log(chat)
  }
})

// by default, we connect using the SL_USERNAME, SL_PASSWORD, and SL_START
// environment variables -- alternatively, you can just pass those values in
client.connect()
```

More complete examples can be found in the [`examples`](https://github.com/gwigz/homunculus/tree/main/packages/homunculus-core/examples) folder.

Also, check out the [quick start](https://homunculus.inworld.link/en/docs/core) guide if you're having trouble.

## Acknowledgments

Homunculus has been made possible thanks to these wonderful resources:

- [`libopenmetaverse`](https://github.com/openmetaversefoundation/libopenmetaverse) for kicking off the open-source "metaverse" community
- [`pyogp`](http://wiki.secondlife.com/wiki/PyOGP) by the late Enus Linden and their team
- `node-omv` by Wolfspirit for their proof of concept
- [`node-metaverse`](https://github.com/CasperTech/node-metaverse) for delaying my efforts on [`sljs`](https://github.com/gwigz/sljs-archive)

## Links

- [GitHub Repository](https://github.com/gwigz/homunculus)
- [Issue Tracker](https://github.com/gwigz/homunculus/issues)
