import React, { useState } from 'react'
import Label from '../Label'
import icons from '../../img/sprites.svg'
import './index.css'

function PasswordField(props) {

    const [showPassword, setShowPassword] = useState(false)
    const toggleShowPassword = () => setShowPassword(!showPassword)

    let type = 'password'
    let containerClass = 'inline-block'
    let iconName = '#icon-remove_red_eye'

    if(showPassword){
        type = 'text'
        iconName = '#icon-visibility_off'
    } 

    if(props.full) containerClass = 'block'

    return (
        <div className={ containerClass }>
            { props.label && <Label label={props.label} id={props.id} /> }
            <div className='password-field-container' >
                <input
                    className = 'password-field'
                    type = { type } 
                    value = { props.value }
                    id = { props.id } 
                    placeholder={ props.placeholder } 
                    onChange = { props.onChange } 
                    autoComplete='off' />

                <div className='password-field-icon-container' onClick={toggleShowPassword}>
                    <svg className='password-field-icon'>
                        <use href={ icons + iconName } />
                    </svg>
                </div>
            </div>
        </div>
        )
}

export default PasswordField