FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ ./.yarn/
RUN yarn install --immutable
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
