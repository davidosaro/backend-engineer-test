FROM node:18-alpine
WORKDIR /app
RUN npm install
COPY package.json package-lock.json ./
COPY . .
COPY .env .env

CMD ["npm", "start"]
EXPOSE 3000
