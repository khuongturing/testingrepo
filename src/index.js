import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import rootReducer from './reducers';

import { BrowserRouter } from 'react-router-dom';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer, composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render( 
   
        <Provider store={store}>
            <BrowserRouter> 
                <App />
            </BrowserRouter>
        </Provider>
    , 
    document.querySelector('#root')
);

export default createStore(rootReducer);