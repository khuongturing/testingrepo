export default (state = [], action) => {

    switch(action.type) {
        case 'SELECTED_DEPARTMENT':
                return action.payload;  
        default:
                return state;
    }
        
};