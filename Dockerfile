FROM node:carbon-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN yarn install
RUN yarn build

ENV NODE_ENV="production"
EXPOSE 3000

CMD ["yarn", "run", "start"]
