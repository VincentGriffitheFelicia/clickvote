import React from 'react'
import './index.css'
import icons from '../../img/sprites.svg'

function Success(props) {

    return (
        <div className='success-container'>
            <div className='success-icon-container'>
                <svg className='success-icons'>
                    <use href={icons + '#icon-check'} />
                </svg>
            </div>
            <p className='mr-auto text-success'>{props.children}</p>
            <div className='success-close-icon-container' onClick={props.onClick}>
                <svg className='success-icons'>
                    <use href={icons + '#icon-highlight_remove'} />
                </svg>
            </div>
        </div>
    )
}

export default Success
