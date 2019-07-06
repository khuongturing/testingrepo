import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ShoppingCart from './navigation/ShoppingCart';
import ShippingAddress from './navigation/ShippingAddress';
import StripePayment from './navigation/StripePayment';
import ContentPage from './ContentPage';

import '../css/ShopMateHeader.css';

const RouterPage = () => (
    <main>
      <Switch>
        <Route exact path='/' component={ContentPage}/>
        <Route path='/shoppingCart' component={ShoppingCart}/>
        <Route path='/shippingAddress' component={ShippingAddress}/>
        <Route path='/billingAddress' component={StripePayment}/>
      </Switch>
    </main>
 )
  
 export default RouterPage;