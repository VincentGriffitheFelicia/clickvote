import React from 'react'
import './index.css'
import icons from '../../img/sprites.svg'

function Error(props) {

    return (
        <div className='error-container'>
            <div className='error-icon-container'>
                <svg className='error-icons'>
                    <use href={icons + '#icon-warning'} />
                </svg>
            </div>
            <p className='mr-auto text-danger'>{props.children}</p>
            <div className='error-close-icon-container' onClick={props.onClick}>
                <svg className='error-icons'>
                    <use href={icons + '#icon-highlight_remove'} />
                </svg>
            </div>
        </div>
    )
}

export default Error
