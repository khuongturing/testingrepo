import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

let token = null;

it("it should successfully logged in a user", done => {
  const loginDetails = {
    email: "rex102@gmail.com",
    password: "1234567"
  };
  chai
    .request(app)
    .post("/api/v1/customers/login")
    .send(loginDetails)
    .end((err, res) => {
      token = res.body.accessToken;
      res.should.have.status(201);
      done(err);
    });
});

describe("POST new orders", () => {
  it("it should successfully add new ordes", done => {
    const orderDetails = {
      cart_id: "1",
      shipping_id: 2,
      tax_id: 2
    };
    chai
      .request(app)
      .post("/api/v1/orders")
      .send(orderDetails)
      .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(201);
        done(err);
      });
  });
});

describe("GET orders made by customers", () => {
  it("it should get one orders", done => {
    chai
      .request(app)
      .get("/api/v1/orders/inCustomer")
      .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET a particular orders", () => {
  it("it should return 200", done => {
    chai
      .request(app)
      .get("/api/v1/orders/2000")
      .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET order's short details", () => {
  it("it should get one order", done => {
    chai
      .request(app)
        .get("/api/v1/orders/shortDetail/1")
        .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
  it("it should get one order", done => {
    chai
      .request(app)
        .get("/api/v1/orders/shortDetail/2000")
        .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

