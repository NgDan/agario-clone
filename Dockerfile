FROM node:12

WORKDIR /usr/src/agario-clone

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]