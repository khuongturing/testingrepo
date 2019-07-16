import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /attributes", () => {
  it("it should get all attributes", done => {
    chai
      .request(app)
      .get("/api/v1/attributes")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular attributes", () => {
  it("it should get one attributes", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/1")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/2000")
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
      .get("/api/v1/attributes/inProduct/2000")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/inProduct/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/inProduct/1")
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
      .get("/api/v1/attributes/values/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/values/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/attributes/values/2000")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});
