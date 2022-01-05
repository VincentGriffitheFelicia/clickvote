import React from 'react'
import SideNav from '../../../components/SideNav'
import VotersPage from '../../VotersPage'

function AuditorPage() {
    return (
        <div>
            <SideNav />
            <VotersPage position='auditor' />
        </div>
    )
}

export default AuditorPage
