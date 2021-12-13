import React from 'react'
import './index.css'

function Heading(props) {

    let elem = <h1 className={`${props.classes} h1`}>{props.children}</h1>;

    if(props.h3) elem = <h3 className={`${props.classes} h3`}>{props.children}</h3>;

    return elem
}

export default Heading
