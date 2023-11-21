# ASB Export Server

Forwards Ark dino exports from consoles to ASB on the desktop

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

There are a few variables controlling some of the server limitations:
```
# Example .env file
MAX_EXPORT_SIZE=4096    # Max size of allowed Ark dino export files
MAX_SERVER_SIZE=2048    # Max size of allowed Ark server multiplier files
MAX_CONNECTIONS=1000    # Max number of concurrent listener connections

# @sveltejs/adapter-node
BODY_SIZE_LIMIT=8192    # Max size of any request body
```

## Build

Optional, if you don't have a multi-arch builder:
```
docker buildx create --name multiarch --use
```

```
docker buildx build --platform=linux/amd64,linux/arm64/v8 -t coldino/asb-export-server --push .
```
