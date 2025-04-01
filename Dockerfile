FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY .env .env

CMD ["npm", "start"]
EXPOSE 3000
