import React from 'react'
import logo from '../../img/logo.svg'

function Logo(props) {
    return (
        <img className={props.classes} src={logo} alt={props.alt} />
    )
}

export default Logo
