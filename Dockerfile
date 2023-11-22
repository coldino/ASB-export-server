FROM node:20-alpine AS build

RUN apk update && apk upgrade
RUN npm install -g pnpm

# Add non root user to the docker image and set the user
RUN adduser -D svelteuser
USER svelteuser
WORKDIR /app

COPY --chown=svelteuser:svelteuser . /app

RUN pnpm install --frozen-lockfile && pnpm build



FROM node:20-alpine AS production
WORKDIR /app

RUN apk update && apk upgrade && apk add dumb-init curl && adduser -D svelteuser
USER svelteuser

COPY --chown=svelteuser:svelteuser --from=build /app/build /app/package.json ./

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
CMD ["dumb-init", "node", "index.js"]
HEALTHCHECK --interval=15s --timeout=4s --start-period=10s --retries=2 CMD curl --fail http://localhost:3000/api/v1/status || exit 1
