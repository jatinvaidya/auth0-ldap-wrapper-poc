FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY src/server.js .
COPY .env .
CMD [ "node", "server.js" ]
EXPOSE 1389
