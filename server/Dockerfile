FROM node:alpine3.11
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci -qy

COPY . .

EXPOSE 80

CMD ["npm", "start"]
