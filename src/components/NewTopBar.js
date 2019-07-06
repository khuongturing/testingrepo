import React from 'react';
import { Link } from 'react-router-dom';

import '../css/NewTopBar.css';

class NewTopBar extends React.Component {

        state = {};

        render() {
        
          if(this.props.warn === "false") {
            return null;
          }           
          
          /* ITEMS TO SHOW WHEN USER LOGS IN*/
          return (  
          
              <div id='userMenu' className="ui secondary pointing menu">
                  <div className={`headerText`}>Welcome!  </div>
                  <pre>   </pre>
                  <div className={`ui item userNameLogged`}>
                          {this.props.username}   
                  </div>              
                  <div className="ui horizontal item list">                  
                      <Link to="/shoppingCart" className="item"> <div className="item"><i className="shopping bag icon"></i>My Bag </div> </Link>
                        
                      <Link to="/shippingAddress" className="item"> <div className="item"><i className="user outline icon"></i>My Profile </div> </Link>
                          
                      <div className="item" style={{bottom: '22px', cursor: 'pointer'}} onClick={() => this.props.fromNewBar("false")}><i className="sign-out alternate icon"></i>Logout </div> 
                  </div>            
              
              </div>    
          )
      }
}

export default NewTopBar;