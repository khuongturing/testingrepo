import React from 'react';
import { connect } from 'react-redux';
import { selectCategory, selectProductFromCategory } from '../actions';
import '../css/Categories.css';

class Categories extends React.Component {
    state = {};   

        /* On component mount fire api call and load with categories */
    componentDidMount(){        
        this.props.selectCategory();
    }

        /* Logic to maintain focus on the clicked Category element */ 
    onCategoryClick = (event, category_id) => {
        var siblings = [];
        var sibling = event.currentTarget.parentNode.firstChild;
        while (sibling) {
            if (sibling.nodeType === 1) {
                siblings.push(sibling);
            }
            
            sibling.className = 'item';
            sibling = sibling.nextSibling;
        }
        this.props.selectProductFromCategory(category_id,1);
        event.currentTarget.className = 'item active';
    }

    render(){  
        return (
            this.props.categories.map(category => {
                return(
                    <li className="item" key={category.category_id} onClick = {(event) => this.onCategoryClick(event, category.category_id)}>
                            {category.name}
                    </li> 
                )
            })
        )
    }
}

const mapStateToProps = (state) => {   
    return {categories: state.categories};
}

export default connect(mapStateToProps, { selectCategory, selectProductFromCategory })(Categories);