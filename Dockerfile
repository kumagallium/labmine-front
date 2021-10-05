FROM node:14.4.0-alpine
WORKDIR /code
COPY . .
RUN npm install
RUN npm run build
ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "start"]