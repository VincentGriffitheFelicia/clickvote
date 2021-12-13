import React from 'react'

import { motion } from 'framer-motion' 

import './index.css'
import icons from '../../img/sprites.svg'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: .5
        }
    }
}

function CandidateContainer(props) {

    function camelize(str){
        let arr = str.split('-');
        let capital = arr.map((item, index) => index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase());
        return capital.join("");
    }

    return (
        <div className={`voters-page-container`}>

            <div 
                className={`flex justify-between items-center bg-main-3 px-6 h-20
                ${props.fixedControl ? 'fixed z-50 w-full ml-auto bp-850:w-4/5' : '' }`}>
                <div>
                    <h3 className='font-bold text-xl text-main-8 uppercase'>
                        { props.position }
                    </h3>
                    <p className='text-main-7 font-semibold'>
                        MY VOTE(S): {props.voteCount}/{props.voteLimit}
                    </p>
                </div>
                <div>
                    <button>&larr;</button>
                    <button>&rarr;</button>
                </div>
            </div>

            { props.loading ? (
                    <div className='w-full h-screen flex items-center justify-center text-main-8'>
                        <svg className='w-10 h-10 mt-16 rotate fill-current inline-block'>
                            <use href={icons + '#icon-spinner'} />
                        </svg>
                    </div>
                ) : (
                    <motion.div 
                        className={`cards-container px-6 ${props.fixedControl ? 'pb-8 pt-28' : 'py-8'}`}
                        variants={container}
                        initial='hidden'
                        animate='show'>
                        { props.children }         
                    </motion.div>
                ) 
            }

        </div>
    )
}

export default CandidateContainer
