import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import * as actionTypes from './store/userAuth/actions'
import PrivateRoute from './containers/PrivateRoute';

// Components
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import SignoutPage from './pages/SignoutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SideNav from './components/SideNav';
import MyVotesPage from './pages/MyVotesPage';
import SummaryPage from './pages/SummaryPage'
import VotingLimitsPage from './pages/VotingLimits';
import VotingList from './pages/VotingList'
import CandidateListPage from './pages/CandidateListPage';
import Lobby from './pages/Lobby';
import PresidentPage from './pages/PositionPages/President';
import VicePresidentInternalPage from './pages/PositionPages/VicePresidentInternal';
import VicePresidentExternalPage from './pages/PositionPages/VicePresidentExternal';
import SecretaryPage from './pages/PositionPages/Secretary';
import TreasurerPage from './pages/PositionPages/Treasurer';
import AuditorPage from './pages/PositionPages/Auditor';
import SenatorPage from './pages/PositionPages/Senator';
import AboutPage from './pages/AboutPage';
import FloatingNav from './components/FloatingNav';

function App() {

  const dispatch = useDispatch()
  const history = useHistory()

  const unsubscribeCandidates = useSelector(state => state.candidates.unsubscribe)
  const unsubscribeControlData = useSelector(state => state.controlData.unsubscribe)
  const unsubscribeUserData = useSelector(state => state.userData.unsubscribe)

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
      unsubscribeCandidates && unsubscribeCandidates()
      unsubscribeControlData && unsubscribeControlData()
      unsubscribeUserData && unsubscribeUserData()
    }
  }, [])

  return (
    <React.Fragment>
      <Switch>
        <Route exact path='/'>
          <LandingPage />
        </Route>

        {/* NOTE SUMMARY */}
        <PrivateRoute 
          exact path='/summary'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <SideNav />
            <FloatingNav />
            <SummaryPage/>
        </PrivateRoute>

        {/* NOTE PRESIDENT */}
        <PrivateRoute
          exact path='/president'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
          <FloatingNav />
          <PresidentPage />
        </PrivateRoute>

        {/* NOTE VICE PRESIDENT INTERNAL */}
        <PrivateRoute
          exact path='/vice-president-internal'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <VicePresidentInternalPage />
        </PrivateRoute>

        {/* NOTE VICE PRESIDENT EXTERNAL */}
        <PrivateRoute
          exact path='/vice-president-external'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <VicePresidentExternalPage />
        </PrivateRoute>

        {/* NOTE SECRETARY */}
        <PrivateRoute
          exact path='/secretary'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <SecretaryPage />
        </PrivateRoute>

        {/* NOTE TREASURER */}
        <PrivateRoute
          exact path='/treasurer'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <TreasurerPage />
        </PrivateRoute>

        {/* NOTE AUDITOR */}
        <PrivateRoute
          exact path='/auditor'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <AuditorPage />
        </PrivateRoute>

        {/* NOTE SENATOR */}
        <PrivateRoute
          exact path='/senator'
          criteria={['userData', 'userAuth', 'candidates', 'controlData']} >
            <FloatingNav />
            <SenatorPage />
        </PrivateRoute>

        <PrivateRoute
          exact path='/my-votes'
          criteria={['userData', 'userAuth', 'candidates', 'controlData', 'voter']} >
            <SideNav />
            <FloatingNav />
            <MyVotesPage />
        </PrivateRoute>

        <PrivateRoute
          exact path='/voting-list'
          criteria={['userData', 'userAuth', 'candidates', 'controlData', 'admin']} >
            <SideNav />
            <FloatingNav />
            <VotingList />
        </PrivateRoute>

        <PrivateRoute
          exact path='/voting-list/:id'
          criteria={['userData', 'userAuth', 'candidates', 'controlData', 'admin']} >
            <SideNav />
            <FloatingNav />
          <CandidateListPage />
        </PrivateRoute>

        <PrivateRoute
          exact path='/voting-limits'
          criteria={['userData', 'userAuth', 'candidates', 'controlData', 'admin']} >
            <SideNav />
            <FloatingNav />
            <VotingLimitsPage />
        </PrivateRoute>

        <Route exact path='/forgot-password'>
          <ForgotPasswordPage />
        </Route>

        <Route exact path='/sign-up'>
          <SignupPage />
        </Route>

        <PrivateRoute
          exact path='/sign-out'
          criteria={['userAuth']} >
            <SignoutPage />
        </PrivateRoute>

        <PrivateRoute
          exact path='/lobby'
          criteria={['userAuth']} >
            <Lobby />
        </PrivateRoute>

        <Route exact path='/about'>
          <AboutPage />
        </Route>
        

      </Switch>
    </React.Fragment>
  );
}

export default App;