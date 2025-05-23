# `@gwigz/homunculus-*`

Homunculus is a minimal set of Node.js packages that allows basic interactions with the virtual world
[Second Life](https://www.secondlife.com), utilizing the official
[Second Life UDP protocol](http://wiki.secondlife.com/wiki/Protocol).

Homunculus _is not affiliated with or sponsored by Linden Research, Linden Lab or
Second Life._

> [!CAUTION]
>
> **This library is a work in progress!**
>
> It is not intended for use yet, large changes are due to happen. This library is primarily intended for chat functionality in Second Life. Other features may not work as intended or may be incomplete. Use at your own risk.

## Workspaces

### [`@gwigz/homunculus-core`](./packages/homunculus-core)

Node.js framework for building scripted agents, and minimal clients. Documentation, and more examples to come later. Several **core features** are also currently **not functional**, check back later!

<div align="center">
  <img src="./packages/homunculus-terminal/terminal.png" />
</div>

### [`@gwigz/homunculus-terminal`](./packages/homunculus-terminal)

Example terminal client, used for general debugging and testing.

### [`@gwigz/homunculus-docs`](./app/homunculus-docs)

Holds our homepage, guides, and documentation.

## Acknowledgments

Homunculus has been made possible thanks to these wonderful resources:

- [`libopenmetaverse`](https://github.com/openmetaversefoundation/libopenmetaverse) for kicking off the open-source "metaverse" community
- [`pyogp`](http://wiki.secondlife.com/wiki/PyOGP) by the late Enus Linden and their team
- `node-omv` by Wolfspirit for their proof of concept
- [`node-metaverse`](https://github.com/CasperTech/node-metaverse) for delaying my efforts on [`sljs`](https://github.com/gwigz/sljs-archive)
