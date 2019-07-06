import React from 'react';
import '../css/Footer.css';

const Footer = () => {

    return (          
            <div className={`ui segment pointing footerBar`} >
                <i className={`big circular inverted instagram icon iconFooter`}></i>
                <i className={`big circular inverted pinterest icon iconFooter`}></i>
                <i className={`big circular inverted twitter icon iconFooter`}></i>
                <i className={`big circular inverted facebook icon iconFooter`}></i>

                <div className={`footerDiv`}>                    
                    <span className={`footerSpan`}><i className='circular copyright outline icon'></i>2019 Shopmated Ltd</span>
                    <span className={`footerSpan`} style={{paddingTop: '4px'}}>Contact  </span>
                    <span className={`footerSpan`} style={{paddingTop: '4px'}}>Privacy Policy </span>
                </div>
            </div> 
       
     );
}

export default Footer;