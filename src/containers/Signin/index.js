import React, { useState } from 'react'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword, } from '@firebase/auth'
import validator from 'validator'

import TextField from '../../components/TextField'
import PasswordField from '../../components/PasswordField'
import Heading from '../../components/Heading'
import Button from '../../components/Button'
import Link from '../../components/Link'
import Error from '../../components/Error'
import icons from '../../img/sprites.svg'
import './index.css'

function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        let error = []

        if(!validator.isEmail(email)) error.push({
            id: 'email',
            message: 'The provided email is not valid.'
        })

        if(error.length === 0) {
            try {
                await signInWithEmailAndPassword(auth, email, password)
            }catch(err) {

                if(err.code === 'auth/user-not-found') {
                    error.push({
                        id: 'user-not-found',
                        message: 'User not found. Please check your email address.'
                    })
                } else if(err.code === 'auth/wrong-password') {
                    error.push({
                        id: 'wrong-password',
                        message: 'Incorrect password. Please check your password.'
                    })
                } else {
                    error.push({
                        id: 'other-errors',
                        message: 'Failed to login. Please try again.'
                    })
                }
            }
        }

        setErrors(error)
        setLoading(false)
    }

    const handleCloseError = (index) => {
        const errorsCopy = [...errors]
        errorsCopy.splice(index, 1)
        setErrors(errorsCopy)
    }

    return (
        <form className='form-container text-center' onSubmit={handleSubmit}>
            <Heading h3 classes='mt-4 mb-10'>
                Sign in
            </Heading>

            { errors.length ? (
                <div className='mb-10 text-left'>
                    { 
                        errors.map((err, idx) => (
                            <Error key={err.id} onClick={() => handleCloseError(idx)}>
                                {err.message}
                            </Error>
                        ))
                    }
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-y-6">
                <TextField 
                    placeholder='Username'
                    value={email}
                    full
                    onChange={(e) => setEmail(e.target.value)} />
                <PasswordField 
                    placeholder='Password'
                    value={password}
                    full
                    onChange={(e) => setPassword(e.target.value)} />
                <Button primary full disabled={loading}>
                    { 
                        loading && (
                            <svg className='w-6 h-6 mr-2 rotate fill-current inline-block'>
                                <use href={icons + '#icon-spinner'} />
                            </svg>
                        ) 
                    }
                    Submit
                </Button>
            </div>
            <Link classes='mt-6 inline-block text-center' underlined to='/forgot-password'>
                Forgot Password?
            </Link>
            {/* <Link classes='mt-6 inline-block text-center' underlined to='/something'>
                Something
            </Link> */}
        </form>
    )
}

export default Signin