import React from 'react'
import { motion } from 'framer-motion'

const variants = {
    hidden: { opacity: 0, x: '100vw' },
    show: { opacity: 1, x: 0, transition: { type: 'tween', duration: .4, ease: 'easeInOut' } },
    close: { opacity: 0, x: '-100vw' }
}

function Backdrop(props) {

    let classes = 'min-h-screen h-screen w-full fixed top-0 left-0 overflow-x-auto text-main-8'

    if(!props.show) {
        classes = 'hidden'
    }

    return (

        <motion.div
            style={{ backgroundColor: 'rgba(60, 61, 91, 0.95)', zIndex: 500 }}
            className={classes}
            variants={variants}
            initial='hidden'
            animate='show'
            exit='close'>
            { props.children }
        </motion.div>

    )
}

export default Backdrop
