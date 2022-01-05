import React from 'react'
import Label from '../Label'

function TextArea({value, className, label, id, onChange, placeholder}) {
    return (
        <div>
            { label && <Label label={label} id={id} /> }
            <textarea
                id={id} 
                className={`text-field block resize-none ${className}`}
                placeholder={placeholder}
                rows={5} 
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default TextArea
