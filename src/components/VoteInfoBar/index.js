import React from 'react'
import './index.css'

function VoteInfoBar({ fixed, position, voteCount, voteLimit, hideVoteCount, voteCountOnly }) {
    return (
        <div
            className={`flex justify-between items-center bg-main-2 px-6 h-20
            ${fixed ? 'fixed top-0 right-0 z-40 vote-info-bar' : 'mb-8' }`}>
            <div>
                <h3 className='font-bold text-xl text-main-8 uppercase' style={{letterSpacing: 2}}>
                    { position }
                </h3>
                { 
                    hideVoteCount ? null : (
                        <p className='text-main-7 font-semibold' style={{letterSpacing: 1}}>
                            MY VOTE(S): { voteCount }/{ voteLimit }
                        </p>) 
                }
                {  
                    voteCountOnly ? (
                        <p className='text-main-7 font-semibold' style={{letterSpacing: 1}}>
                            MY VOTE(S): { voteCount }
                        </p>
                    ) : null 
                }
            </div>
        </div>
    )
}

export default VoteInfoBar
