export default (state = {data:[], depId:'', catId:''}, action) => {

    switch(action.type) {
        case 'SELECTED_PRODUCT':
                return {
                    data: action.payload, 
                    departmentId: action.departmentId,
                    categoryId: action.cateogryId,
                };  
        default:
                return state;
    }
        
};