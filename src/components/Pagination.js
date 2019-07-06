import React from 'react';
import { connect } from 'react-redux';
import '../css/Pagination.css';
import { selectProduct, selectProductFromCategory, selectProductFromDepartment, selectCategory, searchProduct } from '../actions';

class Pagination extends React.Component {

    constructor(props){
        super(props);
        this.searchingFor = this.searchingFor.bind(this);
    }
    
    // Returns the products name and description information based on the user search term
    searchingFor(term){
        return function(x){
            return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
        }
    }    

    /* Load the desired products from category and department based on the selected page number */
    onPageClick = (event, pageNo) => { 

        var siblings = [];
        var sibling = event.currentTarget.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
            
            sibling.className = 'item';
            sibling = sibling.nextSibling;
        }

        // Fire the corresponding api based on the page number clicked by user
        
        if(this.props.departmentId.length === 0 && this.props.categoryId.length === 0 ) {
            this.props.selectProduct(pageNo);
            event.currentTarget.className = 'item active';  
        }

        else if(this.props.departmentId.length > 0) {
            this.props.selectProductFromDepartment(this.props.departmentId, pageNo);
            event.currentTarget.className = 'item active'; 
        }

        else if(this.props.categoryId.length > 0) {
            this.props.selectProductFromCategory(this.props.categoryId, pageNo);
            event.currentTarget.className = 'item active'; 
        }

    }

    render(){ 

        const {search,products,productsCount} = this.props;
        const noOfProductsPerPage = 20;  // 20 product cards per page as default view
        let pageCount;


        /* Have to load page nos dynamically based on search term component */
        if(search.searchResultsCount > 0){
            pageCount = Math.ceil(search.searchResultsCount / noOfProductsPerPage);            
        }  
        else if(products){
            pageCount = Math.ceil(productsCount / noOfProductsPerPage);
        }

        /* Have to maintain focus on the first page on load and returns page nos dynamically*/
        
        let pages = [];
        for(let i=2 ; i<= pageCount; i++) {
            pages.push(i);
        }

        const PageNos = pages.map((page, index) =>                 
                    
                        <li key={index} className='item' onClick = {(event) => this.onPageClick(event,page)}>
                                    {page}
                        </li>                       
                );

        /* To set focus on the first page number */        
        
        if(productsCount < 20) {
            return (
                <li className='item active' onClick = {(event) => this.onPageClick(event,1)}>  1 </li>                 
            )
        } else {
            return (
                <div className={`pageNoStart`}>
                    <li className='item active' onClick = {(event) => this.onPageClick(event,1)}>  1 </li>  
                    {PageNos}
                </div>
            )            
        }
    }
}

const mapStateToProps = (state) => {
    return { productsCount: state.products.data.count, 
             departmentId: state.products.departmentId,
             categoryId: state.products.categoryId,
             products: state.products.data.rows,
             search: state.search
     };
}

export default connect(mapStateToProps, {selectProduct, selectProductFromCategory, selectProductFromDepartment, selectCategory, searchProduct })(Pagination);
