import React, { useCallback, useEffect, useState } from 'react'

import { doc, onSnapshot, collection, query, where } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '../../components/Button'

import { db } from '../../firebase'
import * as userDataActions from '../../store/userData/actions'
import * as controlDataActions from '../../store/controlData/actions'
import * as candidatesActions from '../../store/candidates/actions'
import icons from '../../img/sprites.svg'
import WarningBanner from '../../components/WarningBanner'

function Lobby() {

    const dispatch = useDispatch()
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const activeCandidateList = useSelector(state => state.controlData.activeCandidateList)

    // USER AUTH
    const userAuthId = useSelector(state => state.userAuth.user.uid)

    const fetchData = useCallback( () => {

        setLoading(true)
        setError(null)

        // NOTE USER DATA
        const unsubscribeUserData = onSnapshot(doc(db, 'users', userAuthId), 
        (userDoc) => {

            if(!userDoc.data()) {
                setError('Failed to fetch data! Please try again.')
                setLoading(false)
                return
            }

            dispatch({ 
                type: userDataActions.SET_USER_DATA, 
                user: {...userDoc.data(), id: userDoc.id} 
            })

            // NOTE CONTROL DATA
            const unsubscribeControlData = onSnapshot(doc(db, 'controls', 'rBKfRL1VLoGO2eakapDy'), 
            (controlDoc) => {

                if(!controlDoc.data()) {
                    setError('Failed to fetch data! Please try again.')
                    setLoading(false)
                    return
                }
                
                dispatch({ 
                    type: controlDataActions.SET_CONTROL_DATA, 
                    controlData: {...controlDoc.data(), loaded: true}
                })

                const activeCandidateList = controlDoc.data().activeCandidateList

                const q = query(collection(db, 'candidates'), where('candidateListId', '==', activeCandidateList))

                // NOTE CANDIDATES
                const unsubscribeCandidates = onSnapshot(q, (querySnapshot) => {

                    let candidates = []

                    querySnapshot.forEach((doc) => {
                        candidates.push({
                            ...doc.data(),
                            voted: false,
                            id: doc.id,
                        })
                    });

                    candidates = candidates.reduce((prev, curr) => {
                        prev[curr.position] = prev[curr.position] || []
                        prev[curr.position].push(curr)

                        return prev
                    }, {})

                    dispatch({ 
                        type: candidatesActions.SET_CANDIDATES, 
                        loadedCandidateListId: activeCandidateList,
                        candidates,
                    })

                    setLoading(false)

                }, (error) => {
                    setError(error)
                });

                dispatch({ 
                    type: candidatesActions.SET_CANDIDATES_UNSUBSCRIBE, 
                    unsubscribe: unsubscribeCandidates,
                })
            },
            (error) => {
                // Handle Error here
                // Display a reload page.
                setError(error)
            })
            
            dispatch({ 
                type: controlDataActions.SET_CONTROL_DATA_UNSUBSCRIBE, 
                unsubscribe: unsubscribeControlData 
            })

        },
        (error) => {
            // Handle Error here
            // Display a reload page.
            setError(error)
        })

        dispatch({ 
            type: userDataActions.SET_USER_DATA_UNSUBSCRIBE, 
            unsubscribe: unsubscribeUserData 
        })

        if(!loading) {
            history.replace('/summary')
        }

    }, [history, dispatch, userAuthId, loading])

    useEffect(() => {
        fetchData()
        return () => {
            setLoading(null)
        }
    }, [history, dispatch, activeCandidateList, fetchData])

    return (
        <div className='w-full h-screen flex items-center justify-center bg-main-4 text-main-8'>
            {
                loading && (
                    <svg className='w-10 h-10 mr-2 rotate fill-current inline-block'>
                        <use href={icons + '#icon-spinner'} />
                    </svg>
                )
            }

            {
                error && (
                    <div>
                        <WarningBanner />
                        <Button onClick={fetchData}>Reload</Button>
                    </div>
                )
            }
            
        </div>
    )
}

export default Lobby
