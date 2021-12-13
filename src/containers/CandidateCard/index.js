import React, { useState } from 'react'

import { motion } from 'framer-motion'

import Button from '../../components/Button'
import icons from '../../img/sprites.svg'

import './index.css'

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

    return (

        <motion.div variants={cardVariants} className='h-full'>
            <div className="card-container">
                <div className={`card-flip h-full rounded-xl ${flipped ? 'flip' : ''}`}>
                    <div className="card-front flex flex-col h-full rounded-xl overflow-hidden bg-main-2">
                        <img className='block' src={props.bannerPic} alt="Banner" />
                        <div className='text-center'>
                            <img className='w-1/3 mx-auto rounded-full border-4 border-main-8 hover:border-accent-2' style={{transform: 'translateY(-50%)'}} src={props.profilePic} alt="" />
                        </div>
                        <div className='py-4 px-6 mb-4' style={{marginTop: '-4rem'}}>
                            <h3 className='text-center text-lg uppercase font-bold text-main-8 mb-2'>
                                { props.name }
                            </h3>
                            <p className='text-main-7 text-base'>
                                { props.goal }
                            </p>
                        </div>
                        <div className='px-4 pb-4 h-16 mt-auto flex justify-between items-center'>
                            <Button onClick={() => setFlipped(true)}>About Me</Button>
                            {
                                props.hideVoteBtn ? null : (props.voted ? (
                                    <Button outlined classes='px-8 flex items-center' 
                                        onClick={props.unvoteHandler}>
                                        Unvote
                                    </Button>
                                ): (
                                    <Button primary classes='px-8 flex items-center border-2 border-transparent'
                                        onClick={props.voteHandler}>
                                        Vote
                                        <svg className='w-6 h-6 ml-2 fill-current inline-block'>
                                            <use href={icons + '#icon-how_to_vote'} />
                                        </svg>
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                    <div className="card-back flex flex-col h-full rounded-xl overflow-hidden bg-main-1 py-6">

                        <h4 className='text-main-7 text-center font-semibold text-xl mb-auto'>ABOUT ME</h4>
                        <div className='px-8'>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>NAME</p>
                                <p className='text-main-8 text-lg font-semibold'>{props.name}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>COURSE</p>
                                <p className='text-main-8 text-lg font-semibold'>{props.course}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>YEAR LEVEL</p>
                                <p className='text-main-8 text-lg font-semibold'>{props.yearLevel}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>DEPARTMENT</p>
                                <p className='text-main-8 text-lg font-semibold'>{props.department}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-main-7 text-sm'>GENDER</p>
                                <p className='text-main-8 text-lg font-semibold'>{props.gender}</p>
                            </div>
                        </div>
                        <Button classes='mt-auto self-center' onClick={() => setFlipped(false)}>Close</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CandidateCard
