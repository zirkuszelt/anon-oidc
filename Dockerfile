FROM node:18-alpine

COPY package.json yarn.lock ./
RUN yarn install

COPY src ./src

EXPOSE 8080

CMD ["yarn", "start"]
