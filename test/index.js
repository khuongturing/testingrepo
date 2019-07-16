import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET invalid URL", () => {
  it("it should return invalid URL", done => {
    chai
      .request(app)
      .post("/api/v1/departmentss")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});
describe("GET the index route", () => {
  it("it should return 200 ", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});
