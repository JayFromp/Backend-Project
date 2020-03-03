# Cruddit API

## Background

Here at Northcoders we have been set the task of creating our own version of a popular online site. A page dedicated to different news, articles, topics... whatever you want really. 

This repo is the backend API of the app - the result of being given two sets of data (test & development), knowledge of the MVC design pattern, a number of endpoints to build (and test) and then a weeks timeframe to complete.

Enjoy. 

## Getting started

To view the already hosted version of this api, please go to 'www.insertyourlinkhere.com'.

To run locally:

git clone https://github.com/jayfromp/backend-project
cd Backend-Project

The repo has a number of dependencies already specified in the Package.JSON file. Please use 'npm i' to install them.

## Running migrations
 To run migrations for the test database, please use the scripts "npm run migrate-latest" & "npm run migrate-rollback". For the development database, please use "npm run migrate-latest:prod" & "npm run migrate-rollback:prod"

## Seeding the database 

To seed the test database, please use the script "npm run seed-test" and for the development database, use "npm run seed-prod".

## Endpoints
This api has 13 tested, restful endpoints. Each can either read, put, patch or delete data from the database. Although some methods are not valid in some cases, and will return errors. 

Once a request is made to an endpoint, the request is then sent to the appropriate router and controller, where the necessary information is given to the model function to retrieve the data in the needed format. From here the data is sent back to the controller in a response object, where it is given to the client along with status.

In the event of an error, the user will be provided with a message and appropriate error code.

## Tests
To view tests, please run the script 'npm run test'. The database will re-seed itself after all tests have been run, to avoid any errors from previously manipluated data.

Please use the /api endpoint to view a JSON of all endpoints and the data they return.

```
GET /api

GET /api/topics

GET /api/users
GET /api/users/:username

GET /api/articles
POST /api/articles

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

```

---

Built With
- express
- axios
- knex
- postgres
- supertest
- mocha
- chai


Authors
Jay Compson. 

Acknowledgments
A big thank you to all at Northcoders and the people who likely won't ever read this, but who have put the time into creating the libraries and frameworks which made this possible. 
