# Setup and build the client
FROM node:alpine3.11 as client

WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build

# Setup the server
FROM node:alpine3.11

WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./

ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]
