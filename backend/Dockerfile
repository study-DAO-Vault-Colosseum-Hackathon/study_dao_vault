#use Node.js version 22 
FROM node:22

#create /app folder inside the container
WORKDIR /app

#copy package json and package-lock json files to the /app folder so that npm install can be run to install the dependencies
COPY package*.json ./

#install the dependencies
RUN npm install

#copy all backend files from the current directory to the /app folder inside the container
#the 1st . represents the current directory on the host machine and the 2nd . represents the /app folder inside the container
COPY . .
#﻿COPY <source-in-local> <destination-in-container>

#open port 3000 for the Node.js development server
EXPOSE 3000

#run development server using npm run dev command when the container starts
CMD ["npm", "run", "dev"]