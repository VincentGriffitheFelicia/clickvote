import React from 'react'
import './index.css'

function Label(props) {
    return (
        <label className='label' htmlFor={ props.id }>{ props.label }</label>
    )
}

export default Label
