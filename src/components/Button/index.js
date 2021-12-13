import React from 'react'
import './index.css'

function Button(props) {

    let btnClass = ['default']

    if(props.primary) btnClass.push('primary')
    if(props.full) btnClass.push('full')
    if(props.outlined) btnClass.push('outlined')

    return (
        <button 
            onClick={ props.onClick } 
            disabled={props.disabled}
            className={ `${btnClass.join(' ')} ${props.classes}` }>
            { props.children }
        </button>
    )
}

export default Button
