import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import { query, where, getDocs, collection, writeBatch, doc, increment, serverTimestamp, arrayUnion } from 'firebase/firestore'

import { db } from '../../firebase'

import Button from '../../components/Button'
import CandidateCardList from '../../components/CandidateCardList'
import SideNav from '../../components/SideNav'
import FloatingNav from '../../components/FloatingNav'
import icons from '../../img/sprites.svg'

import * as votesActionTypes from '../../store/votes/actions'
import VoteInfoBar from '../../components/VoteInfoBar'
import WarningBanner from '../../components/WarningBanner'

function MyVotesPage() {

    const dispatch = useDispatch()
    const history = useHistory()

    const order = ['president', 'vicePresidentInternal', 'vicePresidentExternal', 'secretary', 'treasurer', 'auditor', 'senator']

    const [fetchingVotes, setFetchingVotes] = useState(false)
    const [error, setError] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [voteSubmitted, setVoteSubmitted] = useState(false)

    const candidates = useSelector(state => state.candidates.list)
    const votes = useSelector(state => state.votes)
    const votingLimits = useSelector(state => state.controlData.votingLimits)
    const user = useSelector(state => state.userData.user)
    const activeCandidateList = useSelector(state => state.controlData.activeCandidateList)

    // run this if the user has voted already
    const fetchVotes = useCallback(
        async () => {
            try {

                setFetchingVotes(true)
            
                const votesRef = collection(db, 'votes')
                const myQuery = query(votesRef, where('votersId', '==', user.id), where('candidateListId', '==', activeCandidateList));
                const documents = await getDocs(myQuery)

                let votedCandidates = []

                documents.forEach(doc => {
                    votedCandidates.push({
                        ...doc.data(),
                        id: doc.id,
                    })
                })

                let filteredCandidates = {}

                votedCandidates.forEach(voted => {
                    for (const [key, value] of Object.entries(candidates)) {
                        filteredCandidates[key] = filteredCandidates[key] || []
                        for (const candidate of value) {
                            if(candidate.id === voted.candidateId) {
                                filteredCandidates[key].push({ ...candidate })
                            }
                        }
                    }
                })

                dispatch({ 
                    type: votesActionTypes.SET_VOTES, 
                    votes: filteredCandidates
                })

                setFetchingVotes(false)

            } catch(err) {
                setFetchingVotes(false)
                setError(val => val.push('Failed to retrieve your votes! Please try again.'))
            }
        },
        [dispatch, candidates, activeCandidateList, user.id],
    )

    // Run this if the user didn't vote yet
    const getVotedCandidates = useCallback(() => {
        let votedCandidates = { } 
        Object.keys(candidates).forEach(key => {
            votedCandidates[key] = candidates[key].filter(candidate => candidate.voted)
        })

        dispatch({ 
            type: votesActionTypes.SET_VOTES, 
            votes: votedCandidates
        })
        
    }, [dispatch, candidates])
    
    const handleSubmit = async () => {

        // Return if the user already voted!
        if(user.listsVoted.includes(activeCandidateList)) return

        try {

            setSubmitting(true)
            setVoteSubmitted(false)

            const batch = writeBatch(db);

            let votedCandidates = []

            Object.keys(votes).forEach(key => {
                votedCandidates = votedCandidates.concat([...votes[key]])
            })

            votedCandidates.forEach(candidate => {
                const voteData = {
                    candidateId: candidate.id,
                    candidateName: candidate.name,
                    candidateListId: activeCandidateList,
                    votersId: user.id,
                    votersName: user.studentName,
                    votedAt: serverTimestamp(),
                }

                const candidateData = {
                    totalVotes: increment(1)
                    // totalVotes: 0
                }

                const votesRef = doc(db, `votes/${candidate.id}`)
                const candidatesRef = doc(db, `candidates/${candidate.id}`)

                batch.set(votesRef, voteData)
                batch.update(candidatesRef, candidateData)

            })


            const usersRef = doc(db, `users/${user.id}`)
            batch.update(usersRef, { listsVoted: arrayUnion(activeCandidateList) })

            await batch.commit()
            
            setSubmitting(false)
            setVoteSubmitted(true)

        } catch (err) {
            setSubmitting(false)
            setError(val => [...val, 'Vote submission failed! Please try again.'])
        }
    }

    const getPositionText = (position) => {
        if(position === 'vicePresidentInternal') return 'Vice President Internal'
        else if(position === 'vicePresidentExternal') return 'Vice President External'
        else return position
    }
    
    const votedAtLeastOne = useCallback(() => {

        if(user.listsVoted.includes(activeCandidateList)) return true

        for (const key of Object.keys(votes)) {
            for (const candidate of votes[key]) {
                if(candidate.voted) return true
            }
        }

        return false
    }, [votes, user.listsVoted, activeCandidateList])

    const renderCandidates = () => {
        let elements = []
        
        order.forEach(pos => {
            
            votes[pos] && votes[pos].length && (
                elements.push(
                    <React.Fragment key={pos}>
                        <VoteInfoBar
                            position = { getPositionText(pos) } 
                            voteCount = { votes[pos].length } 
                            voteLimit = { votingLimits[pos] }
                            hideVoteCount = { user.listsVoted.includes(activeCandidateList) }
                            voteCountOnly = { user.listsVoted.includes(activeCandidateList) } 
                        />
                        <CandidateCardList
                            className = 'mb-8' 
                            candidates = { votes[pos] }
                            hideVoteBtn = { true }
                        />
                    </React.Fragment>
                )
            )
        })

        return elements
    }

    useEffect(() => {

        async function start() {

            if(user.listsVoted.includes(activeCandidateList)) {
                await fetchVotes()
            } else {
                getVotedCandidates()
            }

        }

        start()

    }, [activeCandidateList, fetchVotes, getVotedCandidates, user.listsVoted])

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' });
    }, [])

    return (
        <React.Fragment>
            <SideNav />
            <FloatingNav />
            <div className='voters-page-container overflow-hidden'>
                { renderCandidates() }
                { 
                    !votedAtLeastOne() ? (
                        <div className='w-full min-h-screen flex justify-center items-center'>
                            <WarningBanner message='No votes!' />
                        </div>
                    ) : (submitting || !user?.listsVoted.includes(activeCandidateList)) ? (
                        <div key='votes-submit-btn' className='w-full ml-auto'>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={submitting}
                                primary
                                classes='mx-auto mt-6 mb-14 px-10 text-lg flex items-center justify-center'>
                                Submit
                                { 
                                    submitting ? (
                                        <svg className='w-6 h-6 ml-2 rotate fill-current inline-block'>
                                            <use href={icons + '#icon-spinner'} />
                                        </svg>
                                    ) : (
                                        <svg className='w-6 h-6 ml-2 fill-current inline-block'>
                                            <use href={icons + '#icon-send'} />
                                        </svg>
                                    )
                                }
                            </Button>
                        </div>
                    ) : null
                }
            </div>
        </React.Fragment>
    )
}

export default MyVotesPage