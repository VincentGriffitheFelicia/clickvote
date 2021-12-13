import React from 'react'
import Label from '../Label'
import './index.css'

function TextField(props) {

    let containerClass = 'inline-block'

    if(props.full) containerClass = 'block'

    return (
        <div className={containerClass}>
            { props.label && <Label label={props.label} id={props.id} /> }
            <input
                className='text-field'
                value={ props.value }
                placeholder={ props.placeholder }
                onChange={ props.onChange } 
                id={ props.id }
                autoComplete='off'
            />
        </div>
    )
}

export default TextField
