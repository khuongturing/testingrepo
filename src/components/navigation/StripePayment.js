import React from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from '../CheckoutForm';

import '../../css/StripePayment.css'


class StripePayment extends React.Component {

    constructor() {
        super();
        this.state = {
          elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
        };
        window.addEventListener('resize', () => {
          if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
            this.setState({elementFontSize: '14px'});
          } else if (
            window.innerWidth >= 450 &&
            this.state.elementFontSize !== '18px'
          ) {
            this.setState({elementFontSize: '18px'});
          }
        });
      }


    render() {

        const {elementFontSize} = this.state;
    
        return (
            // <StripeProvider apiKey="pk_test_nOzdmMn0pCPON26PXM0jBlNA00zSoTLhSP">
            <StripeProvider apiKey="pk_test_NcwpaplBCuTL6I0THD44heRe">
            
                <div className={`mainBillingDiv`}>
                    
                    <h1>Stripe Payment</h1>
                    <Elements>
                        <CheckoutForm fontSize={elementFontSize}/>
                    </Elements>
                </div>            
            
            
            </StripeProvider>
            
        )
    } 
}

export default StripePayment;