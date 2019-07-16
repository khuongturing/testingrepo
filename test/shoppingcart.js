import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("GET /generateUniqueId", () => {
  it("it should generate unique id", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/generateUniqueId")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("POST add new shopping cart", () => {
  it("it should add new shopping cart", done => {
    const shoppingCart = {
      cart_id: 3,
      product_id: 2,
      attributes: "Baby trolley"
    };
    chai
      .request(app)
      .post("/api/v1/shoppingcart/add")
      .send(shoppingCart)
      .end((err, res) => {
        res.should.have.status(201);
        done(err);
      });
  });
});

describe("PUT update shopping cart", () => {
  it("it should update shopping cart", done => {
    const shoppingCart = {
      quantity: 30
    };
    chai
      .request(app)
      .put("/api/v1/shoppingcart/update/5")
      .send(shoppingCart)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET/ move to cart", () => {
  it("it should move to cart", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/moveToCart/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET/ save cart for later", () => {
  it("it should move to cart", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/saveForLater/2")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular shopping cart", () => {
  it("it should get one shopping cart", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/4")
        .end((err, res) => {
          console.log('shopp: ',res.body)
        res.should.have.status(200);
        done(err);
      });
  });
  it("it should return 404", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/4000")
        .end((err, res) => {
          console.log('shopp: ',res.body)
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("GET the total amount of a cart", () => {
  it("it should get the total amount of a cart", done => {
    chai
      .request(app)
      .get("/api/v1/shoppingcart/totalAmount/3")
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});
