import { Router } from 'express';
import attributeRouter from 'src/domains/attribute/router';
import productRouter from 'src/domains/product/router';
import customerRouter from 'src/domains/customer/router';
import departmentRouter from 'src/domains/department/router';
import categoryRouter from 'src/domains/category/router';
import shoppingCartRouter from 'src/domains/shoppingCart/router';
import orderRouter from 'src/domains/order/router';
import taxRouter from 'src/domains/tax/router';
import shippingRegionRouter from 'src/domains/shippingRegion/router';

const baseRouter = Router();

baseRouter.use(attributeRouter);
baseRouter.use(productRouter);
baseRouter.use(customerRouter);
baseRouter.use(departmentRouter);
baseRouter.use(categoryRouter);
baseRouter.use(shoppingCartRouter);
baseRouter.use(orderRouter);
baseRouter.use(taxRouter);
baseRouter.use(shippingRegionRouter);

export default baseRouter;
