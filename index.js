import express from "express";
import bodyParser from "body-parser";

import {
  departmentRoute,
  categoriesRoute,
  attributesRoute,
  productsRoute,
  customersRoute,
  ordersRoute,
  shoppingRoute,
  taxRoute,
  shippingRoute,
  stripeRoute
} from "./routes/index";

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json("Welcome to tshirt shop");
});

app.get("/api/v1/docs", (req, res) => {
  res.redirect("https://documenter.getpostman.com/view/5770396/SVSHsqGT");
});

app.use("/api/v1", departmentRoute);
app.use("/api/v1", categoriesRoute);
app.use("/api/v1", attributesRoute);
app.use("/api/v1", productsRoute);
app.use("/api/v1", customersRoute);
app.use("/api/v1", ordersRoute);
app.use("/api/v1", shoppingRoute);
app.use("/api/v1", taxRoute);
app.use("/api/v1", shippingRoute);
app.use("/api/v1", stripeRoute);

app.use("*", (req, res) => {
  res.status(404).json("Invalid URL");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Working");
});

export default app;
