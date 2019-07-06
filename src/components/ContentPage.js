import React from 'react';

import Categories from './Categories';
import ProductList from './ProductList';
import Pagination from './Pagination';

import '../css/ContentPage.css';

/* Content Page component contains middle portion of the page (Categories sidebar, Pagination and Product List components) */

const ContentPage = () => {
    return (
                <div>                                             
                    
                    <div className={`ui pagination menu pageDiv`}>
                        <div className={`categoryText`}>Categories</div >
                            <div className={`pageStart`}>
                                <Pagination />
                            </div>                                             
                    </div>                   

                    <div className="ui grid">
                        <div className="two wide column">
                            <div className={`ui secondary vertical menu leftSideBar`}>
                                  <Categories /> 
                            </div>
                        </div>
                        <div className="fourteen wide stretched column">
                            <div className={`listHeight`}>
                                  <ProductList />  
                            </div>
                        </div>
                    </div> 

                </div>                    
    
        )         
}

export default ContentPage;