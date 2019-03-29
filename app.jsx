import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux'
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import reducers from './redux/reducers'
import User from './components/user'


const store = createStore(
    combineReducers({
        // ...reducers,
        routing: routerReducer
    })
);

const history = syncHistoryWithStore(browserHistory, store);
const client = new ApolloClient({ uri: 'http://localhost:8000/graphql' });

const ApolloApp = () => <ApolloProvider client={client}>
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={User} />
        </Router>
    </Provider>
</ApolloProvider>;

ReactDOM.render(<ApolloApp />, document.querySelector('#container'));