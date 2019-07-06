import React from 'react';
import { connect } from 'react-redux';
import { selectProduct, selectProductFromCategory, selectProductFromDepartment, searchProduct, openModal, cartId } from '../actions';
import '../css/ProductList.css';
import ModalManager from './ModalManager';

class ProductList extends React.Component {
    state = {data:[], depId:'', catId:'',isOpen: false}; 

    componentDidMount(){
        this.props.selectProduct(1); // 1 is the first page in the product api               
        this.props.cartId();
    }

    /* Open Modal with the selected product card info  */
    openModal = (product) => {
        this.props.openModal({
            name: product.name, 
            description: product.description,
            price: product.price,
            discounted_price: product.discounted_price,
            thumbnail: product.thumbnail, 
            id: product.product_id
        });
    }

    /* Returns list of product cards to be displayed on the screen*/ 
    renderList(){ 

      const {search,products} = this.props;
      let  finalProductList = [];

      if(products !== undefined) {

        /* For a no user search term or search empty return original results */

        if(search.searchResultsCount > 0) {
            finalProductList = search.searchResults;
        } else if(Object.keys(search).length === 0 || search.searchTerm.length === 0 || search.searchTerm.length === 1 ) {
            finalProductList = this.props.products;
        }
        
        return finalProductList.map(product => { 
            return(  
                <div key={product.product_id} className={`ui card productCard`} 
                            onClick = {() => this.props.openModal(product)}>                                               
                    <div className="image">
                        <img className={`productImage`} alt={product.name} src={'https://backendapi.turing.com/images/products/' + product.thumbnail}/>
                    </div>  
                    <div className="content">
                        <div className={`center aligned header productName`}>{product.name}</div>                 
                        <div className={`ui tag labels priceDiv`}>
                            { Number(product.discounted_price) === 0 ? (
                                <button className={`ui left large floated label priceTag`}>${product.price}</button>
                            ) : (
                            <button className={`ui left large floated label priceTag`} 
                                    style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: 'black'}}>${product.price}</button>
                            )}
                            <button className={`ui right large floated label discountPriceTag`}>{Number(product.discounted_price) === 0 ? product.price : product.discounted_price}</button>
                        </div>
                        <div className="description">
                            {product.description}
                        </div> 
                    </div>
                </div>             
            )
        })
      }
    }

    render(){
        /* Generate keys and pass as attributes to avoid warnings from React */
        const generateKey = (pre) => {
            return `${ pre }_${ new Date().getTime() }`;
          }

        return (
            
            <div key={generateKey()} className={`ui cards cardList`}>                    
                    {this.renderList()} 
                <ModalManager />                                   
            </div>
                              
        )
    }
}

const mapStateToProps = (state) => {
    return  {products: state.products.data.rows, productCount: state.products.data.count, search: state.search};
     
}

export default connect(mapStateToProps, { selectProduct, selectProductFromCategory, selectProductFromDepartment, searchProduct, openModal, cartId })(ProductList);