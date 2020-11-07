# YEA
### `YE`t `A`nother express template
This project contains an opinionated little `express.js` template relying on [MongoDB](https://github.com/mongodb/mongo "MongoDB"), [Mongoose](https://github.com/Automattic/mongoose "Mongoose"), [Docker](https://www.docker.com/ "Docker") and [awilix](https://github.com/jeffijoe/awilix "Awilix"). There are plenty of such templates, this one is meant to be yet another needle in the haystack, for those who like express.js, dont need TypeScript and like @decorators, dependency injection and various tools to avoid boilerplate.
## Getting Started
Instructions on how to run, build and configure the project.

### Prerequisites
Install docker      
Install node + npm      
install dependencies with `npm install`     
create a .env file und the root directory with the content provided in .env.example     
~~~
# See .env.example for a full configuration with explanations

##################
# The launch configuration for the server
#     The app auth secert is used in order to create JWTs authorization/refresh 
#       tokens use a random string
# e.g. APP_AUTH_SECRET=12asdo;gjnkq2iwurgbf
##################
APP_AUTH_SECRET=
APP_PORT=

...
~~~
### Starting the Application
The docker/ directory contains a database compose file, use `docker-compose -f "docker/docker-compose-db.yaml" up -d --build` to start a database.  
After that start the a development server with `npm run dev`

OR

`docker-compose -f "docker/docker-compose-dev.yaml" up -d --build`
A development server will be available under the localhost:${APP_PORT} as provided in the .env file

### Building, Linting and Testing
The project provides two scripts in order to transpile and/or linting/testing the code.
Use `npm run lint` for linting and fixing potential style violation
Use `npm run build` in order to produce code which is escurrent compliant and can be run by node
Use `npm run test` to run integration test. THESE TESTS REQUIRE A RUNNING DATABASE (e.g. use the docker/compose-db file for that)


## Documentation
Launch the dev server with `npm run dev` (database is required) and visit `http://localhost:4000/docs` to explore the endpoints

## Project Structure
File structure and general notes

src/    
Is the root directory for the source code. In general the naming conventions of the files matter, since a dependency injection pattern is applied, which requires strict naming.    

build/  
Contains the output of the `npm run build` command and can be executed with `node build/server.js`  

test/   
Contains integration tests which can be run with `npm run test`
docker/     
Contains docker-compose files which are required for CI, local development and production.  

## License
MIT