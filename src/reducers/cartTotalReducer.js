
export default (state = [], action = {}) => {

  switch (action.type) {
    
    case "CART_TOTAL_COUNT": { 
        if(action.payload === 0) 
           return [];
        else if(action.payload === -1)
           return state.slice(Math.round(action.qty));
        else
          return [...state,  action.payload];
    }

    default:
      return state;
  }
};