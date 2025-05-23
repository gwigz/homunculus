# `@gwigz/homunculus-terminal`

Node.js powered text client that allows basic interactions with the virtual world
[Second Life](https://www.secondlife.com), utilizing the official
[Second Life UDP protocol](http://wiki.secondlife.com/wiki/Protocol).

Homunculus _is not affiliated with or sponsored by Linden Research, Linden Lab or
Second Life._

> [!CAUTION]
>
> **This client is a work in progress!**
>
> It is not intended for use yet, it only features basic chat functionality, teleporting, and other features are not yet implemented.

## Features

- Local chat interactions
- Minimal details about nearby objects and avatars
- More to come later...

## Usage

```shell
npx @gwigz/homunculus-terminal

# or at a specific location
npx @gwigz/homunculus-terminal --start "uri:Hippo Hollow&128&128&2"

# also works with Bun (preferred method)
bunx @gwigz/homunculus-terminal
```

Use escape key, `/exit`, or `/quit` to disconnect.

Use [environment values](https://github.com/gwigz/homunculus/blob/main/.env.example) to persist credentials, built-in functionality is coming soon.

<div align="center">
  <img src="./terminal.png" />
</div>

## Acknowledgments

Homunculus has been made possible thanks to these wonderful resources:

- [`libopenmetaverse`](https://github.com/openmetaversefoundation/libopenmetaverse) for kicking off the open-source "metaverse" community
- [`pyogp`](http://wiki.secondlife.com/wiki/PyOGP) by the late Enus Linden and their team
- `node-omv` by Wolfspirit for their proof of concept
- [`node-metaverse`](https://github.com/CasperTech/node-metaverse) for delaying my efforts on [`sljs`](https://github.com/gwigz/sljs-archive)

## Links

- [GitHub Repository](https://github.com/gwigz/homunculus)
- [Issue Tracker](https://github.com/gwigz/homunculus/issues)
