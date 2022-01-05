// userData.user = null
// userAuth.user = null
// candidates.list = null
// controlData.loaded = false

import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PrivateRoute({component, children, criteria, ...rest}) {

    const userDataUser = useSelector(state => state.userData.user)
    const userAuthUser = useSelector(state => state.userAuth.user)
    const candidatesList = useSelector(state => state.candidates.list)
    const controlDataLoaded = useSelector(state => state.controlData.loaded)

    let criteriaFulfilled = true

    if(criteria.includes('userData')) {
        if(!userDataUser) criteriaFulfilled = false
    }

    if(criteria.includes('userAuth')) {
        if(!userAuthUser) criteriaFulfilled = false
    }

    if(criteria.includes('candidates')) {
        if(!candidatesList) criteriaFulfilled = false
    }

    if(criteria.includes('controlData')) {
        if(!controlDataLoaded) criteriaFulfilled = false
    }

    if(criteria.includes('admin')) {
        if(userDataUser && userDataUser.role !== 'admin') {
            criteriaFulfilled = false
        }     
    }

    if(criteria.includes('voter')) {
        if(userDataUser && userDataUser.role !== 'voter') {
            criteriaFulfilled = false
        }
    }

    const Component = component || children

    return (
        <Route
            { ...rest }
            render={() => (
                criteriaFulfilled ? Component : <Redirect to={{ pathname: '/' }} />
            )}
        />
    )
}

export default PrivateRoute
