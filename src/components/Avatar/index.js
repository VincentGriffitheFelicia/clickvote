import React from 'react'
import { useState } from 'react'

function Avatar(props) {

    const [loading, setLoading] = useState(true)

    const handleLoad = () => {
        setLoading(false)

    }

    return (
        <React.Fragment>
            <img 
                className={`${loading ? 'hidden' : 'inline-block object-cover w-full h-full'} rounded-full ${props.className}`} 
                src={props.src} alt="Profile" 
                onLoad={handleLoad}
            />
            { 
                loading && (
                    <div 
                        className={`flex items-center justify-center w-full h-full rounded-full ${props.className}`}>
                        <div 
                            className={`animate-pulse w-full h-full rounded-full bg-main-4`} 
                        />
                    </div>
                ) 
            }
        </React.Fragment>
    )
}

export default Avatar
