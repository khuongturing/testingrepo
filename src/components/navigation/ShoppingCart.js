import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { addToCart, removeFromCart, removeAllItemsFromCart, incrementQuantity, decrementQuantity, cartTotal, cartId, sendOrderInfo } from '../../actions';

import '../../css/ShoppingCart.css';
import _ from 'lodash';
import backendApi from '../../apis/backendApi';
import AuthHelperMethods from '../AuthHelperMethods';

class ShoppingCart extends React.Component {

    Auth = new AuthHelperMethods();   

    tableData = (cartItems) => {

        return (    
            cartItems.map((cartItem,index) =>
                <tr key={cartItem.product_id}>
                    <td><button key={'rem'+index} className={`ui labeled icon button cartRemoveButton`}  onClick={(event) => this.removeItem(cartItem)}>
                            <i key={'close'+index} className="close icon"></i>
                                Remove
                        </button></td>   
                    <td key={'im'+index}><img alt={'im'+index} src={'https://backendapi.turing.com/images/products/' + cartItem.thumbnail} /></td> 
                    <td key={'thu'+index}><img alt={'thu'+index} src={'https://raw.githubusercontent.com/zandoan/turing-frontend/master/Images/product_images/' + cartItem.thumbnail.replace('-thumbnail','-2')} /></td> 
                    <td key={'n'+index}>{cartItem.name}</td>
                    <td>Color: {cartItem.color}, Size: {cartItem.size}</td>
                    <td key={'p'+index}>{Number(cartItem.discounted_price) === 0 ? cartItem.price : cartItem.discounted_price}</td>
                    <td><button className={`ui icon button decCart`} key={'dec'+index}
                                onClick={(event) => this.decrement(cartItem)}><i key={'min'+index} className="minus icon"></i></button>
                        <span className={`qtySpan`}>{cartItem.quantity}</span>
                        <button className={`ui icon button incCart`} key={'inc'+index} 
                                onClick={(event) => this.increment(cartItem)}><i key={'plus'+index} className="plus icon"></i></button>
                    </td>
                    <td key={'st'+index}>
                        {cartItem.subtotal_price? Number(cartItem.subtotal_price).toFixed(2) : Number(cartItem.quantity*(Number(cartItem.discounted_price) === 0 ? cartItem.price : cartItem.discounted_price)).toFixed(2)}
                    </td>
                </tr>
                )               
            )
    }

    increment = (cartItem) => {

        this.props.cartTotal(1,1);
        this.props.incrementQuantity(cartItem);  
    }
  
    decrement = (cartItem) => {
          
        if(cartItem.quantity > 0) {           
            this.props.cartTotal(-1,1);
            this.props.decrementQuantity(cartItem);
        }
    }
  
    removeItem = (cartItem) => {

        this.props.cartTotal(-1, cartItem.quantity);
        this.props.removeFromCart(cartItem);
    }
  
    emptyCart = () => {
        this.props.cartTotal(0,1); 
        this.props.removeAllItemsFromCart();
    }

    placeOrder = (event, CartId) => {
            event.preventDefault();
            console.log('cartid', CartId)
            this.creatOrder(CartId,4,1).then(res => { 
                if(res.toString().match(/Error/)) {
                    //alert('Access unauthorized');
                    console.log('Access unauthorized, token expired');
                    this.relogin();
                } else {
                    console.log(' *** Created Order ****',res);
                    console.log('Order id',res.orderId)
                    this.props.sendOrderInfo(res.orderId, this.Auth.getToken())
                }
            })
            .catch(err => {
                //alert(err);
                console.log('Error in creating order');
            });
            this.props.history.push('/shippingAddress');
    }

    relogin = () => {
        alert('Please re-login');        
    }

    creatOrder = async (cart_id, shipping_id, tax_id) => {
        
        // Get a token from api server using the post api
        const data = "cart_id="+cart_id+"&shipping_id="+shipping_id+"&tax_id="+tax_id;
        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'user-key': this.Auth.getToken()
            }
        }
        const res = await backendApi.post(`/orders`,data, config).then(response => {
            return response.data;
          }).catch(error => {
            return error;
          });
        
        return Promise.resolve(res);      
    }

    render() {
        const {cartItems, shoppingCartId} = this.props;
        const totalPrice = _.sumBy(cartItems, function(s) {
            return (Number(s.discounted_price) === 0 ? s.price : s.discounted_price)*s.quantity
        });
        let CartId = '';
        if(shoppingCartId.length > 0)
             CartId = shoppingCartId[0].cart_id;

        return (
            <div className={`mainCartDiv`}>
                <div className={`cartTopDiv`}>
                    <button className={`ui left floated button cartButton`} onClick={this.emptyCart}>EMPTY CART</button>
                    <label className={`totalLabel`}>Total: {Number(totalPrice).toFixed(2)}</label>
                    <button className={`ui right floated button orderButton`} onClick={(e) => this.placeOrder(e,CartId)}> PLACE ORDER </button>                                     
                </div> 

                <div className={`tableDiv`}>
                    <table className={`ui striped table cartTable`}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Image</th>
                                <th>Print</th>
                                <th>Name</th>
                                <th>Attributes</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>   

                        <tbody>                        
                                {this.tableData(cartItems)}                        
                        </tbody>
                    </table>
                </div>

            </div>         
            
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return  {cartItems: state.cart, shoppingCartId: state.cartId};
     
}

export default withRouter(connect(mapStateToProps, { addToCart, removeFromCart, removeAllItemsFromCart, incrementQuantity, decrementQuantity, cartTotal, cartId, sendOrderInfo })(ShoppingCart));