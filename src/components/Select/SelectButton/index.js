import React from 'react'
import './index.css'
import icons from '../../../img/sprites.svg'

function SelectButton(props) {
    return (
        <button type="button" className='select-btn' onClick={props.onClick}>
            <div className={`w-full truncate ${props.selected ? 'text-main-7' : 'text-main-5 hover:text-main-6'}`}>
                { props.children }
            </div>
            <div className="select-btn-icon-container ">
                <svg className='select-btn-icon'>
                    <use href={ icons + '#icon-select-arrows' }/>
                </svg>
            </div>
        </button>
    )
}

export default SelectButton
