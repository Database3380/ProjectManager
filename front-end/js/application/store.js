import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import appReducer from './reducers/app';
 
const logger = createLogger();

const reducer = combineReducers({
    app: appReducer,
    routing: routerReducer
});

const middleware = applyMiddleware(
    routerMiddleware(browserHistory),
    thunk,
    logger
);

export default createStore(reducer, middleware);
