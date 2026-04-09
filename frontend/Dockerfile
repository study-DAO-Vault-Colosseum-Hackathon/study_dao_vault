#use Node.js version 22
#a Docker image = A pre-built container with Node 22 already installed inside it.
FROM node:22

#create /app folder inside the container
#name can be any /app or /src or /nepal, but /app is community standard
WORKDIR /app 

#copy package json and package-lock json files to the /app folder so that npm install can be run to install the dependencies
COPY package*.json ./

#install the dependencies
RUN npm install

#copy all frontend files from the current directory to the /app folder inside the container
#the 1st . represents the current directory on the host machine and the 2nd . represents the /app folder inside the container
COPY . . 
#﻿COPY <source-in-local> <destination-in-container>

#open port 5173 for vite development server (cuz we are using react vite development server)
EXPOSE 5173

#run development server using npm run dev command when the container starts
CMD ["npm", "run", "dev"]