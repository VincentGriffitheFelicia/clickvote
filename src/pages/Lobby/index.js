import React, { useCallback, useEffect } from 'react'

import { doc, onSnapshot } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { db } from '../../firebase'
import * as userDataActions from '../../store/userData/actions'
import * as controlDataActions from '../../store/controlData/actions'
import icons from '../../img/sprites.svg'

function Lobby() {

    const dispatch = useDispatch()
    const history = useHistory()

    // USER AUTH
    const userAuthId = useSelector(state => state.userAuth.user.uid)

    const fetchData = useCallback(
        async () => {
            try {

                // NOTE USER DATA
                const unsubscribeUserData = onSnapshot(doc(db, `users/${userAuthId}`), 
                (doc) => {
                    dispatch({ type: userDataActions.SET_USER_DATA, user: {...doc.data(), id: doc.id} })
                },
                (error) => {
                    // Handle Error here
                    // Display a reload page.
                    console.log("Lobby Error, User Data", error)
                })
                dispatch({ type: userDataActions.SET_USER_DATA_UNSUBSCRIBE, unsubscribe: unsubscribeUserData })


                // NOTE CONTROL DATA
                const unsubscribeControlData = onSnapshot(doc(db, 'controls/rBKfRL1VLoGO2eakapDy'), 
                (doc) => {
                   dispatch({ type: controlDataActions.SET_CONTROL_DATA, controlData: {...doc.data()}})
                    
                },
                (error) => {
                    // Handle Error here
                    // Display a reload page.
                    console.log("Lobby Error, Control Data", error)
                })
                
                dispatch({ type: controlDataActions.SET_CONTROL_DATA_UNSUBSCRIBE, unsubscribe: unsubscribeControlData })

                history.replace('/president')

            } catch(err) {
                console.log(err)
            }
        },
        [dispatch, history, userAuthId],
    )

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className='w-full h-screen flex items-center justify-center bg-main-4 text-main-8'>
            <svg className='w-10 h-10 mr-2 rotate fill-current inline-block'>
                <use href={icons + '#icon-spinner'} />
            </svg>
        </div>
    )
}

export default Lobby
