FROM node
COPY . /usr/src/app
WORKDIR /usr/src/app
EXPOSE 3001
RUN npm install && npm run build
CMD ["npm", "run", "start:prod"]