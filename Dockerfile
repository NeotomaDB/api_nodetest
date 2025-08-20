FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]