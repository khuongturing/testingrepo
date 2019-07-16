import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /shipping regions", () => {
  it("it should get all shipping regions", done => {
    chai
      .request(app)
      .get("/api/v1/shipping/regions")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular shipping region", () => {
  it("it should get one shipping region", done => {
    chai
      .request(app)
      .get("/api/v1/shipping/regions/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

    it("it should return 400", done => {
      chai
        .request(app)
        .get("/api/v1/shipping/regions/rt")
        .end((err, res) => {
          res.should.have.status(400);
          done(err);
        });
    });

    it("it should return 404", done => {
      chai
        .request(app)
        .get("/api/v1/shipping/regions/2000")
        .end((err, res) => {
          res.should.have.status(404);
          done(err);
        });
    });
});
