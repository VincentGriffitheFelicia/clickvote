import React from 'react'

function Modal(props) {

    return (
        <div className='p-4 w-full min-h-full flex justify-center items-center'>
            <div className='w-full max-w-lg p-8 bg-main-2 text-main-8 rounded-xl'>
                { props.children }
            </div>
        </div>
    )
}

export default Modal
