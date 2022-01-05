import React, { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

import icons from '../../img/sprites.svg'
import Button from '../../components/Button';
import WarningBanner from '../../components/WarningBanner';

export default function SignoutPage() {

    const [error, setError] = useState(null);

    const handleSignOut = async () => {
        try {
            setError(null)
            await signOut(auth)
        } catch (err) {
            setError('Failed to signout! Please try again.')
        }
    }

    useEffect(() => {
        handleSignOut()
    }, [])

    return (
        <div className='w-full p-4 h-screen flex items-center justify-center bg-main-4 text-main-8'>
            {
                error ? (
                    <div className='w-full h-screen flex flex-col items-center justify-center'>
                        <WarningBanner message={error} />
                        <Button primary classes='mt-4' onClick={handleSignOut}>Sign out</Button>
                    </div>
                ) : (
                    <svg className='w-10 h-10 mr-2 rotate fill-current inline-block'>
                        <use href={icons + '#icon-spinner'} />
                    </svg>
                )
            }
            
        </div>
    )
}