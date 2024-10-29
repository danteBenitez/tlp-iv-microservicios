FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npx", "servor", "dist", "index.html", "8080" ]