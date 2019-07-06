export default (state = [], action) => {

    switch(action.type) {
        case 'SELECTED_REVIEW':
                return action.payload;  
        default:
                return state;
    }
        
};