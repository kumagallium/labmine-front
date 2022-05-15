FROM node:14.4.0-alpine
WORKDIR /code
COPY . .
RUN npm install

RUN chmod +x /code/entrypoint.sh
ENTRYPOINT ["sh","/code/entrypoint.sh"]