FROM node:22-alpine

COPY src src
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 8080
