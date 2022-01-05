import React from 'react'
import SideNav from '../../../components/SideNav'
import VotersPage from '../../VotersPage'

function SenatorPage() {
    return (
        <div>
            <SideNav />
            <VotersPage position='senator' />
        </div>
    )
}

export default SenatorPage
