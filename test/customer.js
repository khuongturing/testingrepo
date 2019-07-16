import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

let token = null;

describe("POST login a user", () => {
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

  it("it should return 404", done => {
    const loginDetails = {
      email: "rex102@gmails.com",
      password: "1234567"
    };
    chai
      .request(app)
      .post("/api/v1/customers/login")
      .send(loginDetails)
      .end((err, res) => {
        res.should.have.status(404);
        done(err);
      });
  });
});

describe("POST signup a new user", () => {
  it("it should successfully signup a new user", done => {
    const signupDetails = {
      name: "John",
      email: "rex102@gmail.com",
      password: "1234567"
    };
    chai
      .request(app)
      .post("/api/v1/customers")
      .send(signupDetails)
      .end((err, res) => {
        res.should.have.status(400);
        done(err);
      });
  });
});

describe("PUT update customer address", () => {
  it("it should successfully update customer address", done => {
    const addressDetails = {
      address_1: "Igbogbo",
      address_2: "Igbe",
      city: "Ikorodu",
      region: "Lagos",
      postal_code: "456783",
      country: "Nigeria"
    };
    chai
      .request(app)
      .put("/api/v1/customers/address")
      .set("authorization", `USER_TOKEN: ${token}`)
      .send(addressDetails)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("PUT update customer credit card", () => {
  it("it should successfully update customer credit card", done => {
    const creditCard = {
      credit_card: "67478480939090393"
    };
    chai
      .request(app)
      .put("/api/v1/customers/creditCard")
      .set("authorization", `USER_TOKEN: ${token}`)
      .send(creditCard)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

describe("GET customer", () => {
  it("it should get a customer", done => {
    chai
      .request(app)
      .get("/api/v1/customers")
      .set("authorization", `USER_TOKEN: ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done(err);
      });
  });
});

