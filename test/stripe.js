import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index";

chai.should();

chai.use(chaiHttp);

describe("POST stripe", () => {
  it("it should successfully charge a customer", done => {
    const stripeDetails = {
      stripeToken: "tok_mastercard",
      order_id: 1,
      description: "tshirt",
      amount: 400,
      currency: "USD"
    };
    chai
      .request(app)
      .post("/api/v1/stripe/charge")
      .send(stripeDetails)
      .end((err, res) => {
        res.should.have.status(201);
        done(err);
      });
  });
});
