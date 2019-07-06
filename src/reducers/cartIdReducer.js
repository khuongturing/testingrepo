
export default (state = [], action = {}) => {

    switch (action.type) {
      
      case "CART_ID": { 
        return [...state,action.payload];  
      }
  
      default:
        return state;
    }
  };