import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Header, Icon,  Modal } from "semantic-ui-react";

import { closeModal, selectAttributes, selectReviews, addToCart, cartTotal, cartId } from "../actions";
import Image from 'react-image-resizer';
import _ from 'lodash';

import '../css/ModalManager.css';
import Rating from 'react-rating';
import backendApi from '../apis/backendApi';

export class ModalManager extends Component {

  constructor(props) {    
    super(props)
    this.state = { props: {} };
  }

  addItemToCart = (modalProps) => {
    let userColorSelected = '';
    let userSizeSelected = '';

    if(document.getElementsByClassName('selectedColorDot').length === 0 || document.getElementsByClassName('selectedSizeButton').length === 0 )
        alert('Please choose Color and Size for the Product');
    else{

      if(document.getElementsByClassName('selectedColorDot').length > 0)
          userColorSelected = document.getElementsByClassName('selectedColorDot')[0].value;
      if(document.getElementsByClassName('selectedSizeButton').length > 0)
          userSizeSelected = document.getElementsByClassName('selectedSizeButton')[0].value;

      let CartId = '';
      if(this.props.shoppingCartId.length > 0)
            CartId = this.props.shoppingCartId[0].cart_id;

      let resultObject = {...modalProps, color: userColorSelected, size: userSizeSelected, quantity:1, cartid: CartId};
      this.apiPostToCart(resultObject).then(res => {          
          console.log('Added item to cart successfully',res);
      }).catch(err => {
          console.log('Error in adding item to cart',err);
      });
      this.props.addToCart(resultObject);
      this.props.cartTotal(1,1);
    }

  }

  apiPostToCart = async (resultObject) => {
        
    // Get a token from api server using the post api
    const data = "cart_id="+resultObject.cartid+"&product_id="+resultObject.product_id+"&attributes="+resultObject.color+","+resultObject.size;
    
    const res = await backendApi.post(`/shoppingcart/add`, data).then(response => {
        return response.data;
      }).catch(error => {
        return error;
      });
    
    return Promise.resolve(res);      
}

  addColorToCart = (event) => {
    
    let siblings = [];
    var sibling = event.currentTarget.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
            
            sibling.className = 'colorDot';
            sibling = sibling.nextSibling;
          }

    event.currentTarget.className = 'selectedColorDot';  
  }

  addSizeToCart = (event) => {
    
    let siblings = [];
    var sibling = event.currentTarget.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
            
            sibling.className = 'sizeButton';
            sibling = sibling.nextSibling;
          }

    event.currentTarget.className = 'selectedSizeButton';

  }

/* Configurable Modal to hold all product information, color, size and review information of the products */
  configureModal = (modalProps,defaultProps) => {

      const { attributes, reviews} = this.props;
      const generateStars = (num) => {
        if(num < 0)
          num = 0;
        const a = [...Array(num).keys()];        
        return (
        <span>{a.map((num,index) => { return <i key={index} className={`fa fa-star starColor`}></i> } )} </span>)
      }      

      const img = 'https://backendapi.turing.com/images/products/' + modalProps.thumbnail;
      const imgF = 'https://raw.githubusercontent.com/zandoan/turing-frontend/master/Images/product_images/' + modalProps.thumbnail.replace('-thumbnail','-2');
     
      this.props.selectAttributes(modalProps.product_id);
      const colors = _.filter(this.props.attributes,['attribute_name', 'Color']); 
      const sizes = _.filter(attributes,['attribute_name', 'Size']);
      
      const Sizes = sizes.map((size,index) =>                                           
      <button className={`ui circular label sizeButton`} key={'size'+index} value={size.attribute_value} 
              onClick={(event) => this.addSizeToCart(event, modalProps, size.attribute_value)}>{size.attribute_value}</button>) 

      const Colors = colors.map((color) =>                                           
      <button className = {`colorDot`} key={color.attribute_value}         
              style={{backgroundColor: color.attribute_value}} 
              value={color.attribute_value} 
              onClick={(event) => this.addColorToCart(event, modalProps, color.attribute_value)}></button>)  

      this.props.selectReviews(modalProps.product_id);
      const Reviews = reviews.map((review, index) =>
      
        <div className="comment" key={'review'+index}>
            <button className="avatar">
              <img alt="avatar" src="https://img.icons8.com/material-rounded/50/000000/user.png"/>
            </button>
            <div className="content">
              <div className="author" key={review.name}>{review.name}</div>
              <div className="metadata">
                <span className="date" key={review.created_on}>{review.created_on}</span> 
              </div>
              <div key={review.review} className="text">
                {review.review}
              </div>
              <div key={'star'+index}>                
                {generateStars(review.rating)}
              </div>              
            </div>
        </div>)

    return (
    <Modal size='small' {...Object.assign({}, modalProps, defaultProps)}>
      <Modal.Content image>                                    
        <div className={`imageDivModal`}>                                        
            <Image src={img} height="200" width="200"> </Image>  
            <Image alt="orgImage" height="200" width="200" src={imgF} style={{position: 'relative', top: '200px'}}> </Image>  
        </div>
        
        <div className={`headerDivModal`} >                                    
            <Header as='h1'>{modalProps.name}</Header>

            <div className={`priceDivModal`} style={{display:'flex', flexDirection:'row'}}>
                <span className={`priceModal`}>  ${modalProps.price}   </span>
                <span className={`discountedPriceModal`}> ${Number( modalProps.discounted_price ) === 0 ? modalProps.price : modalProps.discounted_price}</span>
            </div>

            <p className={`descriptionModal`}>{modalProps.description}</p>

            <span className={`sizeColorTextModal`}>Size </span>
                <div className={`sizeContainer`}>{Sizes}</div>

            <br /><span className={`sizeColorTextModal`}>Color </span>
            <div className={`colorContainer`}>{Colors} </div>

            <br />
                <button className={`ui right floated button cartButton`} onClick={() => this.addItemToCart(modalProps)}>
                    Add to Cart <Icon name='right chevron' />
                </button>           

            <br /><br /><span style={{fontWeight: 'bold', fontSize: '18px'}}>Leave Review </span>
            
            <form className="ui reply form">
                <div className="field">
                  <textarea></textarea>
                </div>
                <div>
                  <button className={`ui blue labeled submit icon button cartButton`} onClick={(e) => e.preventDefault()}>
                    <i className="icon edit"></i> Leave Review 
                  </button>
                  <Rating emptySymbol="fa fa-star-o fa-2x" style={{color:'#f30965'}}
                          fullSymbol="fa fa-star fa-2x" start={0} step={1} initialRating={1} />
                </div>
                
            </form>

            <br /><span style={{fontWeight: 'bold%', fontSize: '18px'}}>Reviews </span>
            <div className="ui comments">
                {Reviews}
            </div>                              
        
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={this.props.closeModal}>
            Close 
        </Button>
      </Modal.Actions>

    </Modal>)
  }

  
  render() {
    const { modalConfiguration} = this.props;
    const defaultProps = {
      defaultOpen: true,
      closeIcon: true,
      onClose: this.props.closeModal
    };

    let renderedComponent;
    if (modalConfiguration) {
      const { modalProps = {} } = modalConfiguration;        
      renderedComponent = this.configureModal(modalProps, defaultProps);
    }

    return <span>{renderedComponent}</span>;
  }
  
}

function mapStateToProps(state) {
  return { modalConfiguration: state.modals, attributes: state.attributes, reviews: state.reviews, shoppingCartId: state.cartId };
}

export default connect(mapStateToProps, { closeModal, selectAttributes, selectReviews, addToCart, cartTotal, cartId })(ModalManager);
