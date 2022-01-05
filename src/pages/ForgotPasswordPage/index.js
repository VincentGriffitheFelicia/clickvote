import React from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'

import Heading from '../../components/Heading'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import Success from '../../components/Success'
import Error from '../../components/Error'
import Link from '../../components/Link'

import { auth } from '../../firebase'
import icons from '../../img/sprites.svg'
import Paragraph from '../../components/Paragraph'

function ForgotPasswordPage() {

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const closeError = () => setError(null)
    const closeSuccess = () => setSuccess(null)

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await sendPasswordResetEmail(auth, email)
            setSuccess('Password reset email sent. Please check your email.')
            setLoading(false)
        } catch(err) {
            if(err.code === 'auth/invalid-email') {
                setError('Invalid email! Please provide a valid email.')
            } else if(err.code === 'auth/user-not-found') {
                setError('User not found!')
            } else {
                setError('Failed to send reset email! Please try again.')
            }
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen py-10 px-4 flex flex-col justify-center items-center bg-main-2'>
            <Heading h3 classes='mb-10'>Please enter your email.</Heading>
            <div className='w-full max-w-sm grid grid-cols-1 gap-y-2'>
                { success && <Success onClick={closeSuccess}>{ success }</Success> }
                { error && <Error onClick={closeError}>{ error }</Error> }
                <TextField 
                    placeholder='example@gmail.com' 
                    id='email' 
                    value={email}
                    full
                    onChange={(e) => setEmail(e.target.value)} />
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    full
                    primary
                    classes='mt-4 flex items-center justify-center'>
                    { 
                        loading && (
                            <svg className='w-6 h-6 mr-2 rotate fill-current inline-block'>
                                <use href={icons + '#icon-spinner'} />
                            </svg>
                        ) 
                    }
                    Submit
                </Button>
                <div className='mt-8 border-t border-main-3 text-center pt-6'>
                    <Paragraph info classes='inline mr-2 select-none'>Go back to home page?</Paragraph>
                    <Link underlined={true} to='/'>Home page</Link>
                </div>
            </div>
            
        </div>
    )
}

export default ForgotPasswordPage
