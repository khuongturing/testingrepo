import backendApi from '../apis/backendApi';
import _ from 'lodash';
import { SELECTED_CATEGORY , SELECTED_DEPARTMENT, SELECTED_PRODUCT, SEARCH, MODAL_OPEN, MODAL_CLOSE, 
            SELECTED_ATTRIBUTE, SELECTED_REVIEW, ADD, REMOVE, REMOVEALL, INCREMENTQTY, DECREMENTQTY, 
            CART_TOTAL_COUNT, USERPROFILE, CART_ID, ORDER_ID} from './types';

export const selectDepartment = () =>  async dispatch => {
    const response = await backendApi.get('/departments');

    dispatch( {type: SELECTED_DEPARTMENT, payload: response.data });
};

export const selectCategory = () => async dispatch => {
    const response = await backendApi.get('/categories');
        
    dispatch({type: SELECTED_CATEGORY, payload: response.data.rows });   
};

export const selectCategoryFromDepartment = id => async dispatch => {
    const response = await backendApi.get(`/categories/inDepartment/${id}`);

    dispatch({type: SELECTED_CATEGORY, payload: response.data});
};

export const selectProduct = pageNo => async dispatch => {
    const response = await backendApi.get(`/products?page=${pageNo}`);
    
    dispatch({type: SELECTED_PRODUCT, payload: response.data, departmentId: '', cateogryId: '' });   
};

export const selectProductFromDepartment = (id, pageNo) => async dispatch => {
    const response = await backendApi.get(`/products/inDepartment/${id}?page=${pageNo}`);

    dispatch({type: SELECTED_PRODUCT, payload: response.data, departmentId:`${id}`, cateogryId: '' });
};

export const selectProductFromCategory = (id, pageNo) => async dispatch => {
    const response = await backendApi.get(`/products/inCategory/${id}?page=${pageNo}`);

    dispatch({type: SELECTED_PRODUCT, payload: response.data, departmentId: '', cateogryId: `${id}`});
};

export const searchProduct = (searchTerm) => async dispatch => {    

    const response = await backendApi.get(`/products/search?query_string=${searchTerm}`);

    dispatch({type: SEARCH, payload: response.data.rows, searchCount: response.data.count, searchTerm: searchTerm});

};

export const selectAttributes = id => dispatch => _selectAttributes(id, dispatch);
const _selectAttributes = _.memoize(async (id, dispatch) => {
      const response = await backendApi.get(`/attributes/inProduct/${id}`);

      dispatch({type: SELECTED_ATTRIBUTE,  payload: response.data });
});

export const selectReviews = id => dispatch => _selectReviews(id, dispatch);
const _selectReviews = _.memoize(async (id, dispatch) => {
    const response = await backendApi.get(`/products/${id}/reviews`);

    dispatch({type: SELECTED_REVIEW, payload: response.data});
});

export const openModal = (modalProps) => {
    return {
      type: MODAL_OPEN,
      payload: modalProps
    };
};
  
export function closeModal() {
    return {
      type: MODAL_CLOSE 
    };
};

export const cartTotal = (IncDecOperator, qty) => {
    return {type: CART_TOTAL_COUNT, payload: IncDecOperator, qty: qty}
}

export const cartId = () => async dispatch => {
    const response = await backendApi.get('/shoppingcart/generateUniqueId');
        
    dispatch({type: CART_ID, payload: response.data });  
}

export const addToCart = (cart) =>  {

    // const data = "email="+email+"&password="+password;
    //     const config = {
    //         headers: {
    //           'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    //     }
    // const response = await backendApi.post('/shoppingcart/add');

    return {type: ADD, payload: cart};
};

export const removeFromCart = (cart) => {
    return {type: REMOVE, payload: cart};
};

export const removeAllItemsFromCart = (cart) => {
    return {type: REMOVEALL, payload: cart};
};

export const incrementQuantity = (cart) => {
    return {type: INCREMENTQTY, payload: cart};
};

export const decrementQuantity = (cart) => {
    return {type: DECREMENTQTY, payload: cart};
};

export const setShippingAddress = () => async dispatch => {
    // Get a token from api server using the post api
    // const data = "email="+email+"&password="+password;
    // const config = {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // }
    // const response = await backendApi.put('/customers/address', data, config);
        
    // dispatch({type: USERPROFILE, payload: response.data });
}

export const sendOrderInfo = (orderId, token) => async dispatch => {
    const response = await backendApi.get(`/orders/${orderId}`, { headers: { 'user-key': token , 'Content-Type': 'application/x-www-form-urlencoded'}});
        
    dispatch({type: ORDER_ID, payload: response.data });  
}