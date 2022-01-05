import React from 'react'
import Link from '../../components/Link'
import Paragraph from '../../components/Paragraph'
import quote from '../../img/quote.svg'

function AboutPage() {
    return (
        <div className='min-h-screen p-10 flex justify-center items-center bg-main-2'>
            <div className='w-full max-w-md relative'>
                <div className='w-20 absolute top-0 left-0 text-accent-1 z-0' style={{transform: 'translate(-40%, -35%) rotate(-10deg)'}}>
                    <svg className='w-20 h-20 mr-2 fill-current inline-block'>
                        <use xlinkHref={quote + '#quote'} />
                    </svg>
                </div>
                <h3 className='mb-6 z-20 text-main-8 text-4xl font-extrabold block select-none relative'>
                    ABOUT
                </h3>
                <Paragraph classes='lg:text-left font-medium text-lg'>
                    Clickvote is a simple and easy-to-use online voting system designed to make the SSG Election at North Eastern Mindanao State University run more smoothly and quickly. Clickvote was developed as a project for Software Engineering 2.
                </Paragraph>
                <div className='border-t border-main-3 text-center mt-10 pt-6'>
                    <Paragraph info classes='inline mr-2 select-none'>Go back to home page?</Paragraph>
                    <Link underlined to='/'>Home page</Link>
                </div>
            </div>
        </div>
    )
}

export default AboutPage
