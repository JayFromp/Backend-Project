process.env.NODE_ENV = "test";
const { app } = require("../app");
const chai = require("chai");
const { expect } = require("chai");
const request = require("supertest");
const connection = require("../db/utils/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run;
  });
  after(() => {
    return connection.destroy();
  });
  describe("/topics", () => {
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
    it("GET: 400 - route not found. Returns an error if an invalid path is used", () => {
      return request(app)
        .get("/api/wrongPath")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql("Page Not Found");
        });
    });
    it("METHOD: 405 - bad method. Returns an error if a invalid method is used", () => {
      const methods = ["post", "patch", "put", "delete"];
      const promises = methods.map(method => {
        return request(app)[method]("/api/topics");
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.body.msg).to.equal("Method Not Allowed");
          expect(response.status).to.equal(405);
        });
      });
    });
  });
  describe("/users", () => {
    it("GET: 200 - returns a specific user based on a given username parameter", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(response => {
          const user = response.body.user[0];
          expect(user).to.have.keys("username", "name", "avatar_url");
          expect(user.username).to.equal("butter_bridge");
        });
    });
    it("GET: 400 - returns an error if an invalid username is given", () => {
      return request(app)
        .get("/api/users/butterz_road")
        .expect(400)
        .then(response => {
          expect(response.status).to.equal(400);
          expect(response.body.msg).to.equal("username does not exist");
        });
    });
    it("METHOD: 405 - bad method. returns an error if an invalid mehtod is used", () => {
      const methods = ["post", "patch", "put", "delete"];
      const promises = methods.map(method => {
        return request(app)[method]("/api/users/butter_bridge");
      });
      return Promise.all(promises).then(responses => {
        responses.forEach(response => {
          expect(response.status).to.equal(405);
          expect(response.body.msg).to.eql("Method Not Allowed");
        });
      });
    });
  });
  describe("/articles", () => {
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

    it("GET: 404 - returns an error if a valid, but non-existant id is used", () => {
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
});
