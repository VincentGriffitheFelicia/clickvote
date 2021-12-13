import React from 'react'
import './index.css'
import icons from '../../../img/sprites.svg'

function SelectButton(props) {
    return (
        <button type="button" className='select-btn' onClick={props.onClick}>
            <span>
                { props.children }
            </span>
            <div className="select-btn-icon-container">
                <svg className='select-btn-icon'>
                    <use href={ icons + '#icon-select-arrows' }/>
                </svg>
            </div>
        </button>
    )
}

export default SelectButton
