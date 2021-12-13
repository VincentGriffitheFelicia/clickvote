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
                <nav className='nav'>
                    <Logo classes='h-6' />
                    <div>
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
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi nesciunt dicta consectetur voluptatibus, nulla esse eaque exercitationem omnis possimus nihil enim voluptates? Eius itaque ut omnis, deleniti culpa nemo voluptatem.
                        </Paragraph>
                    </div>
                    <Signin />
                </main>
            </div>
        </div>
    )
}

export default LandingPage