import React from 'react'
import './index.css'
import icons from '../../../img/sprites.svg'
function SelectItem(props) {

    let classes = ['select-item']
    let icon = (
        <svg className='select-item-icon'>
            <use href={ icons + '#icon-check' } />
        </svg>
    )
    if(props.active) classes.push('select-item-active')

    return (
        <li className={classes.join(' ')} onClick={props.onClick}>
            {props.children}
            {props.active && icon}
        </li>
    )
}

export default SelectItem
