import React, { useState } from 'react'

import { motion } from 'framer-motion'

import Button from '../Button'
import Avatar from '../Avatar'
import icons from '../../img/sprites.svg'

import './index.css'
import CandidateBanner from '../CandidateBanner'
import { useSelector } from 'react-redux'

const cardVariants = {
    hidden: { y: 100, opacity: 0 },
    show: { 
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 140,
            damping: 10,
            duration: .8
        }
    }
}

function CandidateCard(props) {

    const [flipped, setFlipped] = useState(false)
    const { voted, onVote, onUnVote, hideVoteBtn } = props
    const { bannerPic, profilePic, name, goal, course, yearLevel, department, gender } = props
    const { adminControls, onEdit, onDelete } = props

    const { user } = useSelector(state => state.userData)

    const onFlip = () => setFlipped(true)
    const onUnFlip = () => setFlipped(false)

    return (

        <motion.div variants={ cardVariants } className='h-full'>
            <div className="card-container">
                <div className={`card-flip h-full rounded-xl ${flipped ? 'flip' : ''}`}>
                    <div className="card-front flex flex-col h-full rounded-xl overflow-hidden bg-main-2">
                        <CandidateBanner 
                            className='bg-main-4 text-main-8' 
                            src={ bannerPic } 
                        />
                        <div className='flex justify-center items-center transform -translate-y-1/2'>
                            <div className='w-28 h-28'>
                                <Avatar 
                                    className='border-4 border-main-8 bg-main-6 text-main-8 hover:border-accent-2' 
                                    src={profilePic} />
                            </div>
                        </div>
                        <div className='py-4 px-6 mb-4' style={{marginTop: '-4rem'}}>
                            <h3 className='text-center text-lg uppercase font-bold text-main-8 mb-2'>
                                { name }
                            </h3>
                            <p className='text-main-7 text-base'>
                                { goal }
                            </p>
                        </div>
                        <div className='px-4 pb-4 h-16 mt-auto flex justify-between items-center'>
                            <Button onClick={ onFlip }>About Me</Button>
                            {
                                user.role !== 'admin' && (
                                    hideVoteBtn ? null : (voted ? (
                                        <Button outlined classes='px-8 flex items-center' 
                                            onClick={ onUnVote }>
                                            Unvote
                                        </Button>
                                    ): (
                                        <Button primary classes='px-8 flex items-center border-2 border-transparent'
                                            onClick={ onVote }>
                                            Vote
                                            <svg className='w-6 h-6 ml-2 fill-current inline-block'>
                                                <use href={icons + '#icon-how_to_vote'} />
                                            </svg>
                                        </Button>
                                    ))
                                )
                            }

                            {
                                adminControls && (
                                    <div>
                                        <button className="rounded-full p-2 bg-main-6 hover:bg-main-7 mr-2" onClick={onEdit}>
                                            <svg className='fill-current w-4 h-4'>
                                                <use href={ icons + '#icon-edit' }/>
                                            </svg>
                                        </button>
                                        <button className="rounded-full p-2 bg-main-6 hover:bg-main-7" onClick={onDelete}>
                                            <svg className='fill-current w-4 h-4'>
                                                <use href={ icons + '#icon-trash-2' }/>
                                            </svg>
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="card-back flex flex-col h-full rounded-xl overflow-hidden bg-main-1 py-6">

                        <h4 className='text-main-7 text-center font-semibold text-xl mb-auto mt-4'>ABOUT ME</h4>
                        <div className='px-8 mt-4'>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>NAME</p>
                                <p className='text-main-8 text-lg font-semibold'>{name}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>COURSE</p>
                                <p className='text-main-8 text-lg font-semibold'>{course}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>DEPARTMENT</p>
                                <p className='text-main-8 text-lg font-semibold'>{department}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>YEAR LEVEL</p>
                                <p className='text-main-8 text-lg font-semibold'>{yearLevel}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>GENDER</p>
                                <p className='text-main-8 text-lg font-semibold'>{gender}</p>
                            </div>
                        </div>
                        <Button classes='mt-auto self-center' onClick={ onUnFlip }>Close</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CandidateCard
