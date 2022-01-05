import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';

import App from './App';
import './index.css'
import userAuth from './store/userAuth/reducer'
import userData from './store/userData/reducer'
import candidates from './store/candidates/reducer'
import controlData from './store/controlData/reducer'
import votes from './store/votes/reducer'

const rootReducer = combineReducers({
  userAuth,
  userData,
  candidates,
  controlData,
  votes,
})

// const store = createStore(rootReducer, 
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )
const store = createStore(rootReducer)



ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
