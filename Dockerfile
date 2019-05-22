FROM ubuntu:latest
USER root
WORKDIR /app
COPY ./package.json /app/package.json
RUN apt-get upgrade
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs
RUN npm install


# Copy the current directory contents into the container at /app
COPY . /app

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app
CMD [ "npm", "run", "start" ]


#docker build --tag=apollo .
#docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Or@-uW8p' -e 'MSSQL_PID=Express' -p 1433:1433 -d microsoft/mssql-server-linux:latest
#docker run -p 4000:80 apollographql
