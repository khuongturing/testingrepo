import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /products", () => {
  it("it should get all products", done => {
    chai
      .request(app)
      .get("/api/v1/products")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular product", () => {
  it("it should get one product", done => {
    chai
      .request(app)
      .get("/api/v1/products/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/products/rt")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/products/2000")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET product by category", () => {
  it("it should get category", done => {
    chai
      .request(app)
      .get("/api/v1/products/inCategory/1?description_length=1&page=1&limit=1")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get(
        "/api/v1/products/inCategory/1?description_length=1&page=1&limit=100"
      )
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET product by locations", () => {
  it("it should product", done => {
    chai
      .request(app)
      .get("/api/v1/products/1/locations")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/products/rt/locations")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/products/1000/locations")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET search for products", () => {
  it("it should product", done => {
    chai
      .request(app)
      .get(
        "/api/v1/products/search?query_string=love&all_words=on&description_length=3&limit=20&page=1"
      )
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get(
        "/api/v1/products/search?query_string=love&all_words=on&description_length=3&limit=20&page=10000"
      )
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET product by reviews", () => {
  it("it should return 400", done => {
    chai
      .request(app)
      .get("/api/v1/products/rt/reviews")
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });

  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/products/1000/reviews")
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});
