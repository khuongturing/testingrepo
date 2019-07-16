import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /departments", () => {
  it("it should get all departments", done => {
    chai
      .request(app)
      .get("/api/v1/departments")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});
describe("GET a particular department", () => {
  it("it should get one department", done => {
    chai
      .request(app)
      .get("/api/v1/departments/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

    it("it should return 400", done => {
      chai
        .request(app)
        .get("/api/v1/departments/rt")
        .end((err, res) => {
          res.should.have.status(400);
          done(err);
        });
    });

    it("it should return 404", done => {
      chai
        .request(app)
        .get("/api/v1/departments/2000")
        .end((err, res) => {
          res.should.have.status(404);
          done(err);
        });
    });
});
