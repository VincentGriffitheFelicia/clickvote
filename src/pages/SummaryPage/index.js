import React, { useCallback, useEffect } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector, useDispatch } from 'react-redux';

import { db } from '../../firebase'

import * as candidatesActionTypes from '../../store/candidates/actions'
import WarningBanner from '../../components/WarningBanner';
import icons from '../../img/sprites.svg'
import './index.css'
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { useState } from 'react';

function SummaryPage() {

    const dispatch = useDispatch()
    const controlData = useSelector(state => state.controlData)
    const user = useSelector(state => state.userData.user)
    const candidates = useSelector(state => state.candidates)

    const [changingShowResult, setChangingShowResult] = useState(false)
    const [error, setError] = useState(null)

    const order = ['president', 'vicePresidentInternal', 'vicePresidentExternal', 'secretary', 'treasurer', 'auditor', 'senator']

    const candidatesIsEmpty = () => {
        return Object.keys(candidates.list).length ? false : true
    }

    const fetchData = useCallback(
        async () => {
            try {

                if(!controlData.activeCandidateList) {
                    dispatch({ type: candidatesActionTypes.SET_INFORMATION, data: null})
                    return
                }

                // NOTE CANDIDATE LIST DATA
                const docRef = doc(db, 'candidateList', controlData.activeCandidateList);
                const docSnap = await getDoc(docRef);

                const data = {
                    ...docSnap.data(),
                    id: docSnap.id,
                }
                
                dispatch({ type: candidatesActionTypes.SET_INFORMATION, data})

            } catch(err) {
                setError(err)
            }
        },
        [dispatch, controlData.activeCandidateList],
    )

    const changeShowResult = async (val) => {

        try {
            setChangingShowResult(true)

            await updateDoc(doc(db, 'controls', 'rBKfRL1VLoGO2eakapDy'), {
                showResult: val
            })

            setChangingShowResult(false)

        } catch (err) {
            setChangingShowResult(false)
        }
        

    }

    useEffect(() => {
        
        fetchData()

        return () => {
            dispatch({ type: candidatesActionTypes.SET_INFORMATION, data: null})
        }
    }, [fetchData, dispatch])

    const camelToSentence = (text) => {
        const result = text.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return finalResult
    } 

    return (
        <div className='summary-page-container '>
            <div className={`${controlData.activeCandidateList ? 'py-12 lg:p-12' : ''}`}>
                <div 
                    className={`${controlData.activeCandidateList ? 'bg-main-2 px-8 pt-8 pb-12 lg:px-10 lg:pt-10 lg:pb-14 rounded-xl' : 'min-h-screen flex items-center justify-center'}`}>

                    {/* HEADER */}
                    <div className='mr-auto'>
                        <h3 className='font-bold text-2xl text-main-8 uppercase' style={{letterSpacing: 1}}>
                            { candidates?.listInformation?.title }
                        </h3>
                        <h4 className='font-medium text-xl text-main-7 uppercase'>
                            { candidates?.listInformation?.schoolYear }
                        </h4>
                        <p className='mt-4 text-main-6'>
                            { candidates?.listInformation?.description }
                        </p>

                        {
                            user.role === 'admin' && !candidatesIsEmpty() && (
                                controlData.showResult ? (
                                    <Button outlined disabled={changingShowResult} classes='flex items-center mt-6' onClick={() => changeShowResult(false)}>
                                        <svg className='w-6 h-6 mr-2 fill-current inline-block'>
                                            <use href={icons + '#icon-visibility_off'} />
                                        </svg>
                                        Hide Results
                                    </Button>
                                ) : (
                                    <Button primary disabled={changingShowResult} classes='flex items-center mt-6' onClick={() => changeShowResult(true)}>
                                        <svg className='w-6 h-6 mr-2 fill-current inline-block'>
                                            <use href={icons + '#icon-remove_red_eye'} />
                                        </svg>
                                        Show Results
                                    </Button>
                                )
                            )
                        }
                        
                    </div>

                    {
                        !candidatesIsEmpty() ? (
                            <div>
                                {order.map(pos => (
                                    <React.Fragment key={pos}>

                                        {/* Header */}
                                        {
                                            candidates.list[pos] && (
                                                <div className='mt-8 py-2 px-4'>
                                                    <h3 className='font-bold text-xl text-main-8 uppercase' style={{letterSpacing: 1}}>
                                                        { camelToSentence(pos) }
                                                    </h3>
                                                    <div className='flex justify-between mt-2'>
                                                        <h5 className='font-medium text-l text-main-5 uppercase'>FULL NAME</h5>
                                                        <h5 className='font-medium text-l text-main-5 uppercase'>VOTES</h5>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        {/* Candidates */}
                                        {
                                            candidates.list[pos]?.sort((a, b) => b.totalVotes - a.totalVotes).map(candidate => (
                                                <div className='text-main-6 border-b border-main-5 p-4 hover:bg-main-3' key={candidate.id}>
                                                    <div className='flex justify-between items-center' >
                                                        <div className='flex items-center'>

                                                            {
                                                                controlData.showResult ? (
                                                                    <div className='w-12 h-12 flex-shrink-0'>
                                                                        <Avatar
                                                                            src={candidate.profilePic} 
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className='rounded-full bg-main-6 text-main-3 inline-block' style={{padding: 4}}>  
                                                                        <svg className='w-10 h-10 fill-current'>
                                                                            <use href={icons + '#icon-person'} />
                                                                        </svg>
                                                                    </div>
                                                                )
                                                            }

                                                            <h5 className='font-bold text-l text-main-5 ml-4'>
                                                                { 
                                                                    controlData.showResult ? candidate.name : '????????????????????' 
                                                                }
                                                            </h5>
                                                        </div>
                                                        <h5 className='font-bold text-xl text-main-7 ml-4'>
                                                            { candidate.totalVotes }
                                                        </h5>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        

                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className={`w-full flex justify-center items-center ${controlData.activeCandidateList ? 'mt-8' : ''}`}>
                                <WarningBanner 
                                    message={
                                        controlData.activeCandidateList ? 'No candidates found in the current active list!' : 'No active list!'
                                    } 
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SummaryPage