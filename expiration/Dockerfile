FROM node:alpine

WORKDIR /app
COPY package.json .
# --omit=dev (dev dependencies) 
RUN npm install --omit=dev
COPY . .

CMD ["npm","start"]