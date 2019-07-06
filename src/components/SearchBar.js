
import React from 'react';
import { connect } from 'react-redux';
import { searchProduct, selectProduct } from '../actions';

class SearchBar extends React.Component { 
    
    constructor(props) {
        super(props);
        this.onSearchHandler = this.onSearchHandler.bind(this);
     }
    
    onSearchHandler = (event) => {
        let term = event.target.value;  
        this.props.searchProduct(term); 
    }

    render(){    

        return (
            <div className="item">
                <div className="ui icon input">
                    <input type="text" placeholder="Search Anything ..." onChange={this.onSearchHandler}/>
                        <i className="search link icon"></i>
                </div>
            </div>
        )
    }
}

export default connect(null, {searchProduct, selectProduct})(SearchBar);