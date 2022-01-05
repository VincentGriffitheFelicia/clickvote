import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import CandidateCardList from '../../components/CandidateCardList'
import VoteInfoBar from '../../components/VoteInfoBar'
import WarningBanner from '../../components/WarningBanner'
import * as candidatesActionTypes from '../../store/candidates/actions'

import './index.css'

function VotersPage(props) {

    const dispatch = useDispatch()

    const candidates = useSelector(state => state.candidates.list[props.position])
    const user = useSelector(state => state.userData.user)
    const activeCandidateList = useSelector(state => state.controlData.activeCandidateList)
    const votingLimits = useSelector(state => state.controlData.votingLimits)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, [])

    const getVoted = () => {

        if(!candidates.length) return []
        return candidates.filter((val) => val.voted)
    }

    const checkToHideVoteBtn = (data) => {

        if(!votingLimits) return false
        if(user.listsVoted.includes(activeCandidateList)) return true

        const limit = votingLimits[props.position]
        const voted = getVoted()

        if(limit === voted.length && !data.voted) return true
        else return false
    }

    const onVote = (id) => {

        const limit = votingLimits[props.position]
        const voted = getVoted()

        if(voted.length < limit) {
            dispatch({ type: candidatesActionTypes.VOTE_CANDIDATE, position: props.position, id: id })
        }
    }

    const onUnVote = (id) => {
        dispatch({ type: candidatesActionTypes.VOTE_CANDIDATE, position: props.position, id: id });
    }

    const getPositionText = (position) => {
        if(position === 'vicePresidentInternal') return 'Vice President Internal'
        else if(position === 'vicePresidentExternal') return 'Vice President External'
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
        <div className='voters-page-container overflow-hidden'>
            {
                candidates?.length ? (
                    <React.Fragment>
                        <VoteInfoBar 
                            fixed 
                            position = { getPositionText(props.position) } 
                            voteCount = { getVoteCount() } 
                            voteLimit = { getVotingLimit() } 
                            hideVoteCount = { user.listsVoted.includes(activeCandidateList) || user.role === 'admin' }
                        />
                        <CandidateCardList
                            className = 'mt-28 pb-8' 
                            candidates = { candidates }
                            onVote = { onVote }
                            onUnVote = { onUnVote }
                            hideVoteBtn = { checkToHideVoteBtn }
                        /> 
                    </React.Fragment>
                ) : (
                    <div className='w-full min-h-screen flex justify-center items-center'>
                        <WarningBanner 
                            message={
                                activeCandidateList ? 'No candidates found in the current active list!' : 'No active list!'
                            } 
                        />
                    </div>
                )
            }
        </div>
    )
}

export default VotersPage
