export default (state = [], action) => {

    switch(action.type) {
        case 'SELECTED_ATTRIBUTE':
                return action.payload;  
        default:
                return state;
    }
        
};