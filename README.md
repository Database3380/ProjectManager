## Project Manager

### Setup
- Install Docker from [docker.com](https://www.docker.com/)
- Pull down repository
- Make sure Docker is running
- Open terminal or command prompt and get inside project directory
- Run `docker-compose up`
- You should see a bunch of text for the building of the docker containers (this could take a bit)
- Once that is all done you should see `dbproject_1  | [nodemon] starting node ./bin/www`
- Open a new terminal or command prompt window to the project directory
- Run `docker ps`
- Copy the container id for the image named dbproj_dbproject
- Run `docker exec -it <container_id> bash`
- You will be inside the node server container now, run `npm install bcrypt` and then `exit`
- Copy container_id for the image named dbproj_db
- Run `docker exec -it <container_id> bash`
- Run `psql -U postgres` and check if the relations exist by running `\dt`
- Run `INSERT INTO departments (name) VALUES ('Human Resources');` then `\q` then `exit`
- Now open browser and go to `localhost:3000`, you should see 'Homepage'
- Go to `localhost:3000/departments` and you should see the newly created department

When you edit files they will automatically be updated in the docker containers and the server will restart, no need to do anything other than edit and save.

To stop the docker-compose just hit `ctrl + c` in terminal or command prompt where it is running.

To start it up anytime after the inital set-up just run `docker-compose up`, no need to do any of the other steps.

### Additional Tools
- [Postman](https://www.getpostman.com/) for sending post requests to routes. This will allow you to send fake data to test routes that create or edit rows in the database.