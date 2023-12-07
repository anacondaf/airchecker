FROM node:17-alpine

WORKDIR /dashboard/app

COPY package.json .

RUN npm i

COPY . .

CMD [ "npm", "run", "prod" ]