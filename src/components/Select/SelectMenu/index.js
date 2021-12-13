import React from 'react'
import './index.css'
function SelectMenu(props) {

    let classes = 'select-menu'

    if(!props.show) classes = 'select-menu-hidden'

    return (
        <ul className={ classes }>
            { props.children }
        </ul>
    )
}

export default SelectMenu
