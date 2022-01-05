import React from 'react'
import warningSvg from '../../img/warning.svg'

function WarningBanner(props) {
    return (
        <div className='text-center max-w-md w-full p-4'>
            <img src={warningSvg} width='100%' alt="warning" />
            <p className='text-xl font-medium mt-2 text-main-8'>{props.message}</p>
        </div>
    )
}

export default WarningBanner
