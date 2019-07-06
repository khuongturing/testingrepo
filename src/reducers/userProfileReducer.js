
export default (state = [], action = {}) => {

    switch (action.type) {
      
      case "USERPROFILE": { 
        return action.payload;  
      }
  
      default:
        return state;
    }
  };