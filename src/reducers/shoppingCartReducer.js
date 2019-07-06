import _ from 'lodash';

export default (state = [], action) => { 
    
    switch(action.type) { 
            case 'ADD':

                let partition1, partition2;
                if(state.length > 0) {  

                        let r = _.find(state, pi => pi.name === action.payload.name && pi.color === action.payload.color && pi.size === action.payload.size)

                        if(r){
                            // find the location of identical state obj and separate other entries
                            partition1 = _.reject(state, {'name':action.payload.name, 'color':action.payload.color , 'size' : action.payload.size});                            

                            // update the qty for separated object
                            partition2 = _.filter(state, {'name':action.payload.name, 'color':action.payload.color , 'size' : action.payload.size});                            
                            partition2[0].quantity = ++partition2[0].quantity;
                           
                            // return state
                            return [...partition1, partition2[0]];                            
                        }
                        
                }

                return [...state, action.payload];  

            case 'REMOVE':
                  const pList = state.filter(item => !_.isEqual(item,action.payload));
                  return pList;

            case 'REMOVEALL':
                
                return [];
  
            case 'INCREMENTQTY':
                let productIndex = state.findIndex(product => _.isEqual(product,action.payload));
                
                const productList = state.map((product,index) => {
                    if(index === productIndex) {
                      product.quantity +=1;
                      product.subtotal_price = product.quantity*(Number(product.discounted_price) === 0 ? product.price : product.discounted_price);
                      product.subtotal_price = Number(product.subtotal_price).toFixed(2);
                    }
                    return product;
                });
  
                return productList;
  
            case 'DECREMENTQTY':
                let prodIndex = state.findIndex(product => _.isEqual(product,action.payload));
                
                const prodList = state.map((product,index) => {
                    if(index === prodIndex) {
                      product.quantity -=1;
                      if(product.subtotal_price && product.quantity > 1){
                         product.subtotal_price = product.subtotal_price - (Number(product.discounted_price) === 0 ? product.price : product.discounted_price);  
                         product.subtotal_price = Number(product.subtotal_price).toFixed(2);                       
                      } 
                      else if(product.quantity === 1 && product.subtotal_price) {
                         product.subtotal_price = product.subtotal_price - (Number(product.discounted_price) === 0 ? product.price : product.discounted_price);                           
                      } 
                      else if(product.quantity === 0) {
                         product.subtotal_price = 0.00;
                      }
                      else {
                         product.subtotal_price = Number(product.quantity*(Number(product.discounted_price) === 0 ? product.price : product.discounted_price)).toFixed(2);                         
                      }
                    }
                    return product;
                });
                return prodList;

            default:
                return state;
    }
        
};


