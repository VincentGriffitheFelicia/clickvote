import React from 'react'
import './index.css'

function Paragraph(props) {

    return (
        <p className={`${props.classes} paragraph`}>{props.children}</p>
    )
}

export default Paragraph