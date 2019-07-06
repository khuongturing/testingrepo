export default (state = {}, action) => {
    
    switch(action.type) { 
        case 'SEARCH':    
                return {
                    ...state, 
                    searchResults: action.payload,
                    searchResultsCount: action.searchCount,
                    searchTerm: action.searchTerm
                };         
        default:
                return state;
    }
        
};

