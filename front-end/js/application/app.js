import React from 'react';
import ReactDOM from 'react-dom';

import { connect, Provider } from 'react-redux';
import { IndexRoute, Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

class App extends React.Component {
    next() {
        history.push('/something');
    }
    render() {
        return (
            <div>
                <h2>Testing</h2>
                <button
                    onClick={this.next}
                > 
                Next Page
                </button>
            </div>
        )
    }
}

const history = syncHistoryWithStore(createBrowserHistory(), store);
const insertNode = document.getElementById('app');
 
if (insertNode) {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route component={App} />
            </Router>
        </Provider>,
        insertNode
    )
}
