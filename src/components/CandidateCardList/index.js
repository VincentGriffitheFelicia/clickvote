import React from 'react'

import { motion } from 'framer-motion' 

import './index.css'
import CandidateCard from '../CandidateCard'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: .5,
        }
    }
}

function CandidateCardList({ candidates, onVote, onUnVote, hideVoteBtn, className, adminControls, onEdit, onDelete }) {

    return (
        <div className={`candidate-card-list-container ${className}`}>
            <motion.div
                className={`cards-container px-6`}
                variants={container}
                initial={'hidden'}
                animate='show'>
                { 
                    candidates.map(candidate => (
                        <CandidateCard
                            key = { candidate.id }
                            voted = { candidate.voted }
                            hideVoteBtn = { 
                                (typeof hideVoteBtn === 'boolean') ? (
                                    hideVoteBtn
                                ) : hideVoteBtn(candidate)
                            }
                            onVote = { () => onVote(candidate.id) }
                            onUnVote = { () => onUnVote(candidate.id) }
                            bannerPic = { candidate.bannerPic }
                            profilePic = { candidate.profilePic }
                            name = { candidate.name }
                            goal = { candidate.goal }
                            course = { candidate.course }
                            yearLevel = { candidate.yearLevel }
                            department = { candidate.department }
                            gender = { candidate.gender }
                            adminControls = { adminControls }
                            onEdit = { onEdit ? () => onEdit(candidate) : null }
                            onDelete = { onDelete ? () => onDelete(candidate) : null }
                        />
                    ))
                }      
            </motion.div>

        </div>
    )
}

export default CandidateCardList
