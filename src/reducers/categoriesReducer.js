export default (state = [], action) => {

    switch(action.type) {
        case 'SELECTED_CATEGORY':
                return action.payload;  
        default:
                return state;
    }
        
};