import React, { useCallback, useEffect, useState } from 'react'

import { collection, getDocs } from '@firebase/firestore'

import { db } from '../../firebase'

import CandidateContainer from '../../components/CandidateContainer'
import CandidateCard from '../../containers/CandidateCard'
import { useSelector, useDispatch } from 'react-redux'
import * as candidatesActionTypes from '../../store/positions/actions'

function VotersPage(props) {

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)

    const candidates = useSelector(state => state.positions[props.position].candidates)
    const candidatesDocId = useSelector(state => state.positions[props.position].loadedCandidatesDocId)
    const loaded = useSelector(state => state.positions[props.position].loaded)

    const currentCandidatesId = useSelector(state => state.controlData.currentCandidatesId)
    const openForVoting = useSelector(state => state.controlData.openForVoting)
    const showResult = useSelector(state => state.controlData.showResult)
    const votingLimits = useSelector(state => state.controlData.votingLimits)


    const fetchCandidates = useCallback(
        async () => {

            try {

                const candidatesRef = collection(db, `candidates/${currentCandidatesId}/${props.position}`)
                const documents = await getDocs(candidatesRef)

                const candidates = []

                documents.forEach(doc => {
                    candidates.push({
                        ...doc.data(),
                        id: doc.id,
                    })
                })

                dispatch({ 
                    type: candidatesActionTypes.SET_CANDIDATES, 
                    position: props.position,
                    docId: currentCandidatesId,
                    candidates
                })

            } catch(err) {
                console.log(err)
            }
        },
        [dispatch, props.position, currentCandidatesId],
    )

    useEffect(() => {

        async function start() {
            setLoading(true)
            if((candidatesDocId !== currentCandidatesId) || !loaded) {
                await fetchCandidates()
            }
            setLoading(false)
        }

        start()

        return () => {
            setLoading(false)
        }
        
    }, [fetchCandidates, candidatesDocId, loaded, currentCandidatesId])

    const getVoted = () => {

        if(!candidates.length) return []
        return candidates.filter((val) => val.voted)
    }

    const checkToHide = (data) => {

        if(!votingLimits) return false

        const limit = votingLimits[props.position]
        const voted = getVoted()

        if(limit === voted.length && !data.voted) return true
        else return false
    }

    const voteCandidate = (id) => {

        const limit = votingLimits[props.position]
        const voted = getVoted()

        if(voted.length < limit) {
            dispatch({ type: candidatesActionTypes.VOTE_CANDIDATE, position: props.position, id: id })
        }
    }

    const unvoteCandidate = (id) => {
        dispatch({ type: candidatesActionTypes.VOTE_CANDIDATE, position: props.position, id: id });
    }

    const getPositionText = (position) => {
        if(position === 'vicePresident') return 'Vice President'
        else return position
    }

    const getVoteCount = () => {
        return getVoted().length
    }

    const getVotingLimit = () => {
        if(!votingLimits) return 0
        else return votingLimits[props.position]
    }

    return (
        <div className='overflow-hidden'>
            <CandidateContainer 
                loading={loading}
                voteCount={getVoteCount()} 
                voteLimit={getVotingLimit()}
                position={getPositionText(props.position)}
                fixedControl
            >

                {
                    candidates.length ? candidates.map(data => 
                        <CandidateCard 
                            key={data.id}
                            voted={data.voted}
                            hideVoteBtn={checkToHide(data)}
                            voteHandler={() => voteCandidate(data.id)}
                            unvoteHandler={() => unvoteCandidate(data.id)}
                            { ...data } 
                        />) : null
                }
            
            </CandidateContainer>
        </div>
    )
}

export default VotersPage
