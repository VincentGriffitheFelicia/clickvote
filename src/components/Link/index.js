import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import './index.css'

function Link(props) {

    let classes = []

    // If not underlined add default styles
    if(!props.underlined) classes.push('link')

    // Primary Button
    if(props.primary) classes.push('link-primary')

    // Rounded Button
    if(props.rounded) classes.push('link-rounded')

    // Full Width Button
    if(props.full) classes.push('link-full')

    // Underlined Button
    if(props.underlined) classes.push('link-underlined')

    // Default Button
    if(!props.primary) classes.push('link-default')

    return (
        <RouterLink className={`${classes.join(' ')} ${props.classes}`} to={props.to}>
            { props.children }
        </RouterLink>
    )
}

export default Link