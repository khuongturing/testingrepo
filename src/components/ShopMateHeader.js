import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { addToCart, cartTotal, setShippingAddress } from '../actions';
import { Button,  Form,  Grid,  Header,  Message,  Segment,  Modal, Label} from "semantic-ui-react";

import '../css/ShopMateHeader.css';

/* We want to import our 'AuthHelperMethods' component in order to send a login request */
import AuthHelperMethods from './AuthHelperMethods';

import NewTopBar from './NewTopBar';

class ShopMateHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, name: '', email : '', password: '', openRegister: false, userLogIn: "false" };
    this.open = this.open.bind(this);
    this.openRegister = this.openRegister.bind(this);
    this.close = this.close.bind(this);
    this.closeRegister = this.closeRegister.bind(this);
  }

  /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */
  Auth = new AuthHelperMethods();

  openRegister() {
    this.setState({ openRegister: true });
  }

  closeRegister() {
    this.setState({ openRegister: false });
  }

  open() {
    this.setState({ open: true });
  }

  close() {
    this.setState({ open: false });
  }  


  /* Fired off every time the user enters value into the input fields */
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  }

  onSubmit = (event) => { 
    event.preventDefault();
    /* Upon clicking the login button, we will send our entered credentials over to the server for verification. 
       Once verified, store our token and send the protected route. */
        this.Auth.login(this.state.email, this.state.password)
            .then(response => { 
            if(response.toString().match(/Error/)) {
              document.getElementById('loginLabel').innerHTML = 'Email or Password is invalid. !!';
              document.getElementById('loginLabel').style.fontSize = '100%';
            } else {
                document.getElementById('loginLabel').innerHTML = 'Login Successful';
                document.getElementById('loginLabel').style.color = "green !important";
                document.getElementById('loginLabel').style.fontWeight = 'bold';
                document.getElementById('loginLabel').style.fontSize = '150%';
                 this.close();
                 this.setState({userLogIn: "true"})
                 this.Auth.loggedIn();
                 this.Auth.setToken(response.accessToken);
                 //this.props.setShippingAddress();
                 document.getElementById('topLeftMenu').style.display = 'none';
            }
        })
        .catch(err => {
                alert(err);
            })
    }

    registerMessage = () => {
        this.Auth.register(this.state.name, this.state.email, this.state.password)
        .then(res => { console.log(' *** Registration Msg ****',res);
            if(res.toString().match(/Error/)) {
                document.getElementById('greenLabel').innerHTML = 'Registration Unsuccessful !!';
                document.getElementById('greenLabel').style.fontSize = '100%';
            } else {
                document.getElementById('greenLabel').innerHTML = 'Registration Successful';
                document.getElementById('greenLabel').style.color = "green !important";
                document.getElementById('greenLabel').style.fontWeight = 'bold';
                document.getElementById('greenLabel').style.fontSize = '150%';
            }
        })
        .catch(err => {
            alert(err);
        })
    }

    fromNewBar = (e) => {
        this.Auth.logout();
        this.setState({userLogIn: e.toString()});
        document.getElementById('topLeftMenu').style.display = 'block';
    }

  render() {
    return (
      <div id='topHeaderDiv'> 

          <div id='guestBar'>                  
                  <div id='guestMenu' className="ui secondary pointing menu">
                          <NewTopBar warn={this.state.userLogIn} username={this.state.email} fromNewBar = {this.fromNewBar}/>
                          <div id='topLeftMenu' className='guestLeftMenu' >
                              <span className={`headerText`}>Hi!  </span>
                              <button to="/" className={`item signIn`} onClick={this.open}>  Sign In  </button>
                              <span className={`headerText`}>or  </span>
                              <button to="/" className={`item register`} onClick={this.openRegister}>  Register  </button>
                          </div>                          
      
                                      {/* Right Menu of Header Bar */}
                          <div className="right menu">
                            <Link to="/shoppingCart" className="item">
                              <i className={`shopping bag icon big headerIcon`}/>
                              <span className={`floating ui red label cartNumber`} style={{marginLeft: '8% !important'}}>
                                {this.props.total.length}
                              </span>              
                              <div className={`bagText`}>Your Bag</div>  
                            </Link> 
                          </div>
                  </div>   
          </div>        

                        {/* Sign in Modal */}
          <Modal open={this.state.open} onClose={this.close}>
            <Modal.Content>
              <div className="login-form">
                <Grid textAlign="center" style={{ height: "100%" }} verticalAlign="middle">
                  <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="teal" textAlign="center">
                      Sign in
                    </Header>
                    <Form size="large" onSubmit={this.onSubmit}>
                      <Segment stacked>
                        <Form.Input fluid value={this.state.email} onChange={this.handleInputChange} icon="user" iconPosition="left" placeholder="E-mail" type="email" name="email" required/>
                        <Form.Input fluid value={this.state.password} onChange={this.handleInputChange} icon="lock" iconPosition="left" placeholder="Password" type="password" name="password" required/>
                        <Label id='loginLabel' basic color='red'></Label>
                        <Button color="teal" fluid size="large">
                          Login
                        </Button>
                      </Segment>
                    </Form>
                    <Message>
                        New to us? <button href="#" onClick={this.openRegister}>Register</button>
                    </Message>
                  </Grid.Column>
                </Grid>
              </div>
            </Modal.Content>
          </Modal>

                       {/* Register Modal */}
          <Modal open={this.state.openRegister} onClose={this.closeRegister}>
            <Modal.Content>
              <div className="registration-form">
                <Grid textAlign="center" style={{ height: "100%" }} verticalAlign="middle">
                  <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" color="teal" textAlign="center">
                      Register
                    </Header>
                    <Form size="large" onSubmit={this.registerMessage}>
                      <Segment stacked>
                        <Form.Input fluid value={this.state.name} onChange={this.handleInputChange} icon="user" iconPosition="left" placeholder="Name" type="text" name="name" required/>
                        <Form.Input fluid value={this.state.email} onChange={this.handleInputChange} icon="mail" iconPosition="left" placeholder="E-mail" type="email" name="email" required/>
                        <Form.Input fluid value={this.state.password} onChange={this.handleInputChange} icon="lock" iconPosition="left" placeholder="Password" type="password" name="password" required/>
                        <Label id='greenLabel' basic color='red'></Label>
                        <Button color="teal" fluid size="large">
                           Register
                        </Button>
                      </Segment>
                    </Form>
                    <Message>
                        Already have an account <button href="#" onClick={this.open}>Sign In</button>
                    </Message>
                  </Grid.Column>
                </Grid>
              </div>
            </Modal.Content>
          </Modal>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return  {cartItems: state.cart, total: state.cartTotal};   
}


export default connect(mapStateToProps, { addToCart, cartTotal })(ShopMateHeader);
