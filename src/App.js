import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import * as actionTypes from './store/userAuth/actions'

// Components
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import VotersPage from './pages/VotersPage'
import MyVotesPage from './pages/MyVotesPage';
import Something from './pages/Something';
import SideNav from './components/SideNav';
import Lobby from './pages/Lobby';

function App() {

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        dispatch({ type: actionTypes.SET_USER_AUTH, user: user })
        history.replace('/lobby')
      } else {
        history.replace('/')
        dispatch({ type: actionTypes.SET_USER_AUTH, user: null })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [dispatch, history])

  return (
    <React.Fragment>
      <Switch>
        <Route exact path='/'>
          <LandingPage />
        </Route>
        <Route exact path='/president' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='president' />
          </React.Fragment>
        } />
        <Route exact path='/vice-president' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='vicePresident' />
          </React.Fragment>
        } />
        <Route exact path='/secretary' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='secretary' />
          </React.Fragment>
        } />
        <Route exact path='/treasurer' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='treasurer' />
          </React.Fragment>
        } />
        <Route exact path='/auditor' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='auditor' />
          </React.Fragment>
        } />
        <Route exact path='/senator' component={() => 
          <React.Fragment>
            <SideNav />
            <VotersPage position='senator' />
          </React.Fragment>
        } />
        <Route exact path='/something'><Something /></Route>
        <Route exact path='/my-votes'>
          <React.Fragment>
            <SideNav />
            <MyVotesPage />
          </React.Fragment>
        </Route>
        <Route exact path='/sign-up'>
          <SignupPage />
        </Route>
        <Route exact path='/lobby'>
          <Lobby />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;