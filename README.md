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

### Regular Usage  
When you edit files they will automatically be updated in the docker containers and the server will restart, no need to do anything other than edit and save.

To stop the docker-compose just hit `ctrl + c` in terminal or command prompt where it is running.

To start it up anytime after the inital set-up just run `docker-compose up`, no need to do any of the other steps.

### Additional Tools
- [Postman](https://www.getpostman.com/) for sending post requests to routes. This will allow you to send fake data to test routes that create or edit rows in the database.

### Process For Making Changes (Instructions Only For Terminal)
1. Start from clean project directory, check this by running `git status`. You should see 
    ```  
    On branch master  
    nothing to commit, working tree clean  
    ```
2. Create and switch to new branch by running `git checkout -b <new_feature_name>`. This is the equivalent to 
    ```  
    git branch <new_feature_name>  
    git checkout <new_feature_name>  
    ```
3. Run `git status` and you should see
    ```      
    On branch <new_feature_name>  
    nothing to commit, working tree clean  
    ```
4. Make changes, commiting regularly so you can easily rollback any breaking changes. 
5. Once feauture is complete and working as expected, commit any remaining changes and run `git push origin <new_feature_name>`. This will push your branch up to github.
6. From [github](https://github.com/Database3380/ProjectManager) switch to your newly created branch and click `New Pull Request`. Add any comments needed and then `Create Pull Request`
7. Do not merge pull request, we will review pull requests as a team to make sure there are no changes that are incompatible with planned features.
8. Once pull request has been merged you can dispose of the branch if no longer needed. This can be done by running 
    ```  
    git checkout master  
    git push origin --delete <new_feature_name>  
    git branch -d <new_feature_name>  
    ```

*Please let me know if any of the above does not work or does not make sense.*