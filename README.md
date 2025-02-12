# ASB Export Server

Forwards ARK dino exports from consoles to [ASB](https://github.com/cadon/ARKStatsExtractor) on the desktop using the [ASB Export Gun](https://www.curseforge.com/ark-survival-ascended/mods/ark-smart-breeding-export-gun) mod.

## Overview

This is a very simple server that allows ASB to listen for export and server data files sent from the ASB Export Gun mod. No data is stored, ever.

See [API.md](./docs/API.md) for details of the API.

## Dev

This is a SvekteKit app with no real UI to speak of, and just a couple of API routes.

```
pnpm i
pnpm dev
```

## Variables

There are a few environment variables controlling some of the server limits:

```
# Example .env file
MAX_EXPORT_SIZE=4096    # Max size of allowed ARK dino export files
MAX_SERVER_SIZE=2048    # Max size of allowed ARK server multiplier files
MAX_CONNECTIONS=1000    # Max number of concurrent listener connections

# @sveltejs/adapter-node
BODY_SIZE_LIMIT=8192    # Max size of any request body
```

## Build

Optional, if you don't have a Docker multi-arch builder:

```
docker buildx create --name multiarch --use
```

```
docker buildx build --platform=linux/amd64,linux/arm64/v8 -t coldino/asb-export-server --push .
```

## License

This work is licensed as Affero GPL to ensure derived work is also open, but please get in contact if this is a problem and a dual license can be considered.
