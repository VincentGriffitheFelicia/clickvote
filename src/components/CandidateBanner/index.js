import React from 'react'
import { useState } from 'react'

function CandidateBanner(props) {

    const [loading, setLoading] = useState(true)

    const onLoad = () => {
        setLoading(false)
    }

    return (
        <React.Fragment>
            <img 
                className={`${loading ? 'hidden' : 'block'} ${props.className}`} 
                src={props.src} alt="Banner" 
                onLoad={onLoad}
            />
            { 
                loading && (
                    <div 
                        className={`animate-pulse h-48 bg-main-5`} 
                    />
                ) 
            }
        </React.Fragment>
    )
}

export default CandidateBanner
