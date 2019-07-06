import React, {Component} from 'react';
import { connect } from "react-redux";
import {CardElement, injectStripe} from 'react-stripe-elements';
import {sendOrderInfo} from '../actions';
import backendApi from '../apis/backendApi';

const createOptions = (fontSize, padding) => {
    return {
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4',
          },
          padding,
        },
        invalid: {
          color: '#9e2146',
        },
      },
    };
  };

class CheckoutForm extends Component {

  constructor(props) {
    super(props);
    this.state = {complete: false};
  }

  submit = async(ev, orderInfo) => {
    // User clicked submit
    ev.preventDefault();
    let {token} = await this.props.stripe.createToken({name: "Name"});
    const data = "stripeToken="+token.id+"&order_id="+orderInfo[0].order_id+"&description="+orderInfo[0].product_name+"&amount="+orderInfo[0].subtotal.replace('.','');
    console.log('stripe pay click',data)
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let response = await backendApi.post("/stripe/charge",data,config).then(response => {
        console.log("Purchase Complete!", response);
        this.setState({complete: true, elementFontSize: window.innerWidth < 450 ? '14px' : '18px'})
        return response.data;
    }).catch(error => {
        console.log('Stripe Payment gateway error', error)
        return error;
    });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => console.log('[token]', payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  }; 


  render() {
    if (this.state.complete) {
      return (
            <h1 style={{color: 'green'}}>Purchase Complete <i class="check circle outline icon"></i></h1>
            )
    }
    return (

        <form onSubmit={(e) => this.submit(e, this.props.orderInfo)}>
            <div>
                <p>Would you like to complete the purchase?</p>
                <label>
                Card details
                <CardElement
                    {...createOptions(this.props.fontSize)}
                />
                </label>
                <button >Pay</button>
            </div>
         </form>
        

    );
  }
}

function mapStateToProps(state) {
  console.log('stripe page',state)
  return { orderInfo: state.orderInfo[0] };
}

export default injectStripe(connect(mapStateToProps, {sendOrderInfo})(CheckoutForm));