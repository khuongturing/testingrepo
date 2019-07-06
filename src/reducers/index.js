import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import departmentReducer from './departmentsReducer';
import categoryReducer from './categoriesReducer';
import productReducer from './productsReducer';
import searchReducer from './searchReducer';
import modalReducer from './modalReducer';
import attributeReducer from './attributesReducer';
import reviewReducer from './reviewsReducer';
import shoppingCartReducer from './shoppingCartReducer';
import cartTotalReducer from './cartTotalReducer';
import userProfileReducer from './userProfileReducer';
import cartIdReducer from './cartIdReducer';
import orderReducer from './orderReducer';

export default combineReducers({
    form: formReducer,
    departments: departmentReducer,
    categories: categoryReducer,
    products: productReducer,
    search: searchReducer,
    modals: modalReducer,
    attributes: attributeReducer,
    reviews: reviewReducer,
    cart: shoppingCartReducer,
    cartTotal: cartTotalReducer,
    userProfile: userProfileReducer,
    cartId: cartIdReducer,
    orderInfo: orderReducer
});