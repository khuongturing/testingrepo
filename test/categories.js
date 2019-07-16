import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /categories", () => {
  it("it should get all categories", done => {
    chai
      .request(app)
      .get("/api/v1/categories")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular categories", () => {
  it("it should get one category", done => {
    chai
      .request(app)
      .get("/api/v1/categories/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/categories/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/categories/2000")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET category by product", () => {
  it("it should get one category", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inProduct/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inProduct/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inProduct/2000")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});
describe("GET category by department", () => {
  it("it should get one category", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inDepartment/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inDepartment/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/categories/inDepartment/2000")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});
