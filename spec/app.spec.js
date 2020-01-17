process.env.NODE_ENV = "test";
const { app } = require("../app");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const { expect } = require("chai");
const request = require("supertest");
const connection = require("../db/utils/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  it("METHOD: 405 - returns an error if an invalid method is used", () => {
    const methods = ["post", "patch", "put", "delete"];
    const promises = methods.map(method => {
      return request(app)
        [method]("/api")
        .expect(405);
    });
    return Promise.all(promises).then(responses => {
      responses.forEach(response => {
        expect(response.body.msg).to.equal("Method Not Allowed");
      });
    });
  });
  it("GET: 400 - route not found. Returns an error if api is followed by an invalid path is used", () => {
    return request(app)
      .get("/api/wrongPath")
      .expect(400)
      .then(response => {
        expect(response.body.msg).to.equal("Page Not Found");
      });
  });
  describe("/topics", () => {
    describe("- get all topics", () => {
      it("GET: 200 - returns all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(response => {
            const topicsObject = response.body.topics;
            expect(topicsObject).to.be.an("array");
            expect(topicsObject[0]).to.have.keys("slug", "description");
          });
      });
      it("METHOD: 405 - bad method. Returns an error if a invalid method is used", () => {
        const methods = ["post", "patch", "put", "delete"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405);
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.equal("Method Not Allowed");
          });
        });
      });
    });
  });
  describe("/users", () => {
    describe(" - get user by username", () => {
      it("GET: 200 - returns  specific user based on a given username parameter", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(response => {
            const user = response.body.user;
            expect(user).to.have.keys("username", "name", "avatar_url");
            expect(user.username).to.equal("butter_bridge");
          });
      });
      it("GET: 404 - returns an error if an invalid username is given", () => {
        return request(app)
          .get("/api/users/butterz_road")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("username does not exist");
          });
      });
      it("METHOD: 405 - bad method. returns an error if an invalid method is used", () => {
        const methods = ["post", "patch", "put", "delete"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/users/butter_bridge")
            .expect(405);
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.eql("Method Not Allowed");
          });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("- get all articles", () => {
      it("GET: 200 - returns an array of all articles, with an added comment_count property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            const articles = response.body.articles;
            expect(articles).to.be.an("array");
            expect(articles.length).to.equal(12);
            expect(articles[0]).to.have.keys(
              "comment_count",
              "article_id",
              "author",
              "body",
              "created_at",
              "title",
              "topic",
              "votes"
            );
          });
      });
      it("METHODS: 405 - returns an error when a bad method is used", () => {
        const methods = ["delete", "post", "put"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405);
        });
        return Promise.all(promises).then(responses =>
          responses.forEach(response => {
            expect(response.body.msg).to.equal("Method Not Allowed");
          })
        );
      });
    });
    describe("- query articles", () => {
      it("QUERY: 200 - returns all articles sorted by date, in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(response => {
            const articles = response.body.articles;
            expect(articles).to.be.descendingBy("created_at");
          });
      });
      it("QUERY: 200 - returns all articles sorted by a specified query, in a given order", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc")
          .expect(200)
          .then(response => {
            const articles = response.body.articles;
            expect(articles).to.be.ascendingBy("title");
          });
      });
      it("QUERY: 200 - returns all articles filtered by a specified author", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc&author=butter_bridge")
          .expect(200)
          .then(response => {
            response.body.articles.every(article => {
              expect(article.author).to.equal("butter_bridge");
            });
          });
      });
      it("QUERY: 200 - returns all articles filtered by a specified topic", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc&topic=mitch")
          .expect(200)
          .then(response => {
            response.body.articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("QUERY: 200 - returns an array of articles in descending order by default when given a non-existent order value", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=wrongInput")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.be.ascendingBy("title");
          });
      });
      it("QUERY: 400 - returns an error if sorted by an invalid topic", () => {
        return request(app)
          .get("/api/articles?sort_by=wrongInput&order=asc")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, column does not exist");
          });
      });
      it("QUERY: 200 - returns an empty array if author exists but has no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.eql([]);
          });
      });

      it("QUERY: 200 - returns an empty array if topic does exist, but has no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(response => {
            expect(response.body.articles).to.eql([]);
          });
      });

      it("QUERY: 404 - returns an error if topic does not exist", () => {
        return request(app)
          .get("/api/articles?topic=NotATopic")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.eql("input does not exist.");
          });
      });

      it("QUERY: 404 - returns an error if author does not exist", () => {
        return request(app)
          .get("/api/articles?author=NotAnAuthor")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.eql("input does not exist.");
          });
      });
    });
    describe("- get article by ID", () => {
      it("GET: 200 - returns an article with a specified Id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(response => {
            const article = response.body.article;
            expect(article).to.have.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(article.article_id).to.equal(1);
          });
      });
      it("GET: 404 - returns an error if a valid, but non-existent id is used", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.eql("Sorry, id does not exist");
          });
      });
      it("GET: 400 - returns an error if an invalid id is used", () => {
        return request(app)
          .get("/api/articles/jay")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.eql("Sorry, invalid data type given");
          });
      });

      it("METHOD: 405 - returns an error if an invalid method is used", () => {
        const methods = ["put", "post", "delete"];
        const promises = methods.map(method => {
          return request(app)
            [method]("/api/articles/1")
            .expect(405);
        });
        return Promise.all(promises).then(responses => {
          responses.forEach(response => {
            expect(response.body.msg).to.equal("Method Not Allowed");
          });
        });
      });
    });
    describe.only("- patch article", () => {
      it.only("PATCH: 200 - successfully amends articles.votes by a given amount ", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(response => {
            const votes = response.body.article.votes;
            expect(votes).to.equal(101);
          });
      });
      it("PATCH: 404 - returns an error if a valid, but non-existent id is used", () => {
        return request(app)
          .patch("/api/articles/999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, id does not exist");
          });
      });
      it("PATCH: 400 - returns an error if an invalid id is used", () => {
        return request(app)
          .patch("/api/articles/jay")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
      it("PATCH: 400 - returns an error if inc_votes is provided an invalid value-type", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "a" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
    });
    describe("- post comment", () => {
      it("POST: 201", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "When is lunch?" })
          .expect(201)
          .then(response => {
            expect(response.body.comment).to.have.keys(
              "body",
              "article_id",
              "comment_id",
              "created_at",
              "votes",
              "author"
            );
          });
      });
      it("POST: 400 - returns an error when a post does not have all the required keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge" })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, missing required inputs"
            );
          });
      });
      it("POST: 404 - returns an error when an invalid-data type is given", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: 1, body: "When is lunch?" })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, invalid input");
          });
      });
      it("POST: 404 - returns an error if a valid, but non-existent id is used", () => {
        return request(app)
          .post("/api/articles/999/comments")
          .send({ username: "butter_bridge", body: "When is lunch?" })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, invalid input");
          });
      });
      it("POST: 400 - returns an error if an invalid id is used", () => {
        return request(app)
          .post("/api/articles/jay/comments")
          .send({
            username: "butter_bridge",
            body: "When is lunch?"
          })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
    });
  });
  describe("/comments", () => {
    describe("- get comments", () => {
      it("GET: 200 - gets all comments for a specified article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.an("array");
            response.body.comments.forEach(obj =>
              expect(obj.article_id).to.equal(1)
            );
          });
      });
      it("GET: 200 - returns an empty array if an article exists, but has no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.eql([]);
          });
      });
      it("GET: 404 - returns an error if an invalid path is used", () => {
        return request(app)
          .get("/api/articles/1/commentz")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal("Page Not Found");
          });
      });
      it("GET: 404 - returns an error if a valid, but non-existent id is used ", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, invalid article id");
          });
      });
      it("GET: 204 - returns an error if a valid article id is given, which has no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.eql([]);
          });
      });
      it("GET: 400 - returns an error if a non-existent article id is used", () => {
        return request(app)
          .get("/api/articles/jay/comments")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
    });
    describe("- query comments", () => {
      it("QUERY: 200 - returns all comments sorted by 'created_at' by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.descendingBy("created_at");
          });
      });
      it("QUERY: 200 - returns all comments in descending order by default ", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.descendingBy("created_at");
          });
      });
      it("QUERY: 200 - returns all comments in order of a specified query", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.descendingBy("author");
          });
      });
      it("QUERY: 200 - returns all comments in ascending order", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author&order=asc")
          .expect(200)
          .then(response => {
            expect(response.body.comments).to.be.ascendingBy("author");
          });
      });
      it("QUERY: 400 - returns an error when sorted by an non-existent input", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=red&order=asc")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, column does not exist");
          });
      });
      it("QUERY: 400 - returns an error when sorted by an invalid input", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=red&order=red")
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal("Sorry, column does not exist");
          });
      });
      it("METHOD: 405 - returns an error when an invalid method is used", () => {
        return request(app)
          .put("/api/articles/1/comments")
          .send({ inc_votes: 2 })
          .expect(405)
          .then(response => {
            expect(response.body.msg).to.equal("Method Not Allowed");
          });
      });
    });
    describe("- patch comments", () => {
      it("PATCH: 200 - successfully increases the votes on a specified comment by a given value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 2 })
          .expect(200)
          .then(response => {
            expect(response.body.comment).to.have.keys(
              "article_id",
              "author",
              "body",
              "comment_id",
              "created_at",
              "votes"
            );
            expect(response.body.comment.votes).to.equal(16);
          });
      });
      it("PATCH: 200 - returns the same number of votes on a comment if sent an empty object", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(200)
          .then(response => {
            expect(response.body.comment.votes).to.equal(14);
          });
      });
      it("PATCH: 404 - returns an error if a valid, but non-existent id is used", () => {
        return request(app)
          .patch("/api/comments/999")
          .send({ inc_votes: 2 })
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("invalid comment id");
          });
      });
      it("PATCH:404 - returns an error if an invalid comment id is used", () => {
        return request(app)
          .patch("/api/comments/wrongId")
          .send({ inc_votes: 2 })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
      it("PATCH: 400 - returns an error if an attempt to increase votes by an invalid data-type is", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({
            inc_votes: "wrongDataType"
          })
          .expect(400)
          .then(response => {
            expect(response.body.msg).to.equal(
              "Sorry, invalid data type given"
            );
          });
      });
    });
    describe("- delete comments", () => {
      it("DELETE: 204 - successfully deletes a comment", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE: 404 - returns an error if a valid, but non-existent id is used ", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(response => {
            expect(response.body.msg).to.equal("comment id does not exist");
          });
      });
    });
  });
});
