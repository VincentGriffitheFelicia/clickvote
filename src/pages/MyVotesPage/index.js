import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { writeBatch, doc, increment, serverTimestamp } from 'firebase/firestore'

import { db } from '../../firebase'

import Button from '../../components/Button'
import CandidateContainer from '../../components/CandidateContainer'
import CandidateCard from '../../containers/CandidateCard'
import icons from '../../img/sprites.svg'

function MyVotesPage() {

    const order = ['president', 'vicePresident', 'secretary', 'treasurer', 'auditor', 'senator']
    const elements = []
    let votes = {}

    const [loading, setLoading] = useState(false)

    const positions = useSelector(state => state.positions)
    const votingLimits = useSelector(state => state.controlData.votingLimits)
    const userId = useSelector(state => state.userData.user.id)
    const currentCandidatesId = useSelector(state => state.controlData.currentCandidatesId)

    const getVoted = (position) => positions[position].candidates.filter(data => data.voted)
    const handleSubmit = async () => {

        setLoading(true)

        const batch = writeBatch(db);

        for (const position of Object.keys(votes)) {
            votes[position].forEach(vote => {
                const voteData = {
                    candidateId: vote.id,
                    candidatesCollectionId: currentCandidatesId,
                    votersId: userId,
                    votedAt: serverTimestamp(),
                }

                const candidateData = {
                    totalVotes: increment(1)
                }

                const votesRef = doc(db, `votes/${currentCandidatesId}/${position}/${userId}`)
                const candidatesRef = doc(db, `candidates/${currentCandidatesId}/${position}/${vote.id}`)

                batch.set(votesRef, voteData)
                batch.update(candidatesRef, candidateData)
            })
        }

        const usersRef = doc(db, `users/${userId}`)
        batch.update(usersRef, { voted: true })

        await batch.commit()
        alert('VOTE HAS BEEN SAVED.')

        setLoading(false)
    }

    order.forEach(pos => {

        const candidates = getVoted(pos);

        const votesCopy = { ...votes }
        votes = {
            ...votesCopy,
            [pos]: candidates
        }

        if(candidates.length) {
            elements.push(
                <CandidateContainer
                    key={pos} 
                    voteCount={candidates.length} 
                    voteLimit={votingLimits[pos]}
                    position={pos}
                >

                    {
                        candidates.length ? candidates.filter(data => data.voted).map(data => 
                            <CandidateCard 
                                key={data.id}
                                voted={data.voted}
                                hideVoteBtn={true}
                                { ...data } 
                            />) : null
                    }
                </CandidateContainer>
            )
        }
    })

    elements.push(
        <div className='w-full bp-850:w-4/5 ml-auto'>
            <Button 
                onClick={handleSubmit} 
                disabled={loading}
                primary
                classes='mx-auto mt-6 mb-14 px-10 text-lg flex items-center justify-center'>
                Submit
                { 
                    loading ? (
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
    )

    return (
        <div className='bg-main-4 min-h-screen overflow-hidden'>
            { elements.length ? elements : (
                <div className='min-h-screen flex justify-center items-center ml-auto w-4/5'>
                    <h1>There no vote</h1>
                </div>
            ) }
        </div>
    )
}

export default MyVotesPage