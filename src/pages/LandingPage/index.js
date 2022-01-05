import React from 'react'

import Logo from '../../components/Logo'
import Link from '../../components/Link'
import Heading from '../../components/Heading'
import Paragraph from '../../components/Paragraph'
import Signin from '../../containers/Signin'

import './index.css'

function LandingPage() {
    return (
        <div className='bg-main-1'>
            <div className='main-container'>
                <nav className='mt-10 md:mt-2 md:flex items-center justify-between'>
                    <Logo classes='w-1/2 mx-auto sm:w-1/3 md:mx-0 md:h-8 md:w-auto' />
                    <div className='hidden md:block'>
                        <Link to='/about'>About</Link>
                        <Link to='/sign-up' primary rounded>Sign Up</Link>
                    </div>
                </nav>
                <main className='main-content'>
                    <div>
                        <Heading classes='text-center lg:text-left mb-6'>
                            Online Voting System
                        </Heading>
                        <Paragraph classes='text-center lg:text-left'>
                            A particularly simple and easy-to-use platform that could be especially beneficial to the SSG election at North Eastern Mindanao State University.
                        </Paragraph>
                        <div className='w-full grid grid-cols-2 gap-x-4 mt-6 text-center md:hidden'>
                            <Link to='/sign-up' classes='inline-block sm:w-1/2 sm:justify-self-end' primary rounded>Sign Up</Link>
                            <Link to='/about' classes='inline-block sm:w-1/2 sm:justify-self-start' className='md:w-min' primary rounded>About</Link>
                        </div>
                    </div>
                    <Signin />
                </main>
            </div>
        </div>
    )
}

export default LandingPage