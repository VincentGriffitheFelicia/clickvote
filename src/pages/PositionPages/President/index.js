import React from 'react'
import SideNav from '../../../components/SideNav'
import VotersPage from '../../VotersPage'

function PresidentPage() {
    return (
        <div>
            <SideNav />
            <VotersPage position='president' />
        </div>
    )
}

export default PresidentPage
