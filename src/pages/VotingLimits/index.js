import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from '../../components/Button'
import Error from '../../components/Error'
import Success from '../../components/Success'
import TextField from '../../components/TextField'
import { db } from '../../firebase'
import icons from '../../img/sprites.svg'
import './index.css'

export default function VotingLimitsPage() {

    const votingLimits = useSelector(state => state.controlData.votingLimits)
    const [limits, setLimits] = useState({
        ...votingLimits
    })
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)

    const changeHandler = (e, key) => {
            
        setLimits({
            ...limits,
            [key]: e.target.value
        })
        
    }

    const sumbitHandler = async () => {
        
        try {

            setLoading(true)
            let changes = { }

            for (const key of Object.keys(limits)) {

                if(isNaN(limits[key])) {
                    setError('Please input a valid number!')
                    return
                }

                changes[key] = parseInt(limits[key])
            }

            // Update data in database
            await updateDoc(doc(db, 'controls', 'rBKfRL1VLoGO2eakapDy'), {
                votingLimits: changes
            })

            setLoading(false)
            setSuccess('Updated voting limits successfully.')

        } catch(err) {
            setLoading(false)
            setError('Failed to update! Please try again.')
        }

    }

    const handleCloseError = () => setError(null)
    const handleCloseSuccess = () => setSuccess(null)

    return (
        <div className='voting-limits-page-container'>
            <div className='py-8 lg:p-12'>
                <div className='bg-main-2 px-8 pt-8 pb-12 lg:px-10 lg:pt-10 lg:pb-14 rounded-xl overflow-x-auto'>

                    {/* HEADER */}
                    <h3 className='font-bold text-2xl text-main-8 uppercase' style={{letterSpacing: 1}}>
                        VOTING LIMITS
                    </h3>
                    <h4 className='font-medium text-xl text-main-7'>
                        These are the voting limits for SSG Elections.
                    </h4>

                    <div className='mt-8'>
                        {
                            (error || success) && (
                                <div className='mt-4'>
                                    { error && <Error onClick={handleCloseError}>{ error }</Error> }
                                    { success && <Success onClick={handleCloseSuccess}>{ success }</Success> }
                                </div>
                            )
                        }
                    </div>
                
                    <div className='voting-limits-form grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 mb-10'>
                        <TextField
                            label='President'
                            value={limits.president}
                            onChange={(e) => changeHandler(e, 'president')}
                            full
                        />
                        <TextField
                            label='Vice President Internal'
                            value={limits.vicePresidentInternal}
                            onChange={(e) => changeHandler(e, 'vicePresidentInternal')}
                            full
                        />
                        <TextField
                            label='Vice President External'
                            value={limits.vicePresidentExternal}
                            onChange={(e) => changeHandler(e, 'vicePresidentExternal')}
                            full
                        />
                        <TextField
                            label='Secretary'
                            value={limits.secretary}
                            onChange={(e) => changeHandler(e, 'secretary')}
                            full
                        />
                        <TextField
                            label='Treasurer'
                            value={limits.treasurer}
                            onChange={(e) => changeHandler(e, 'treasurer')}
                            full
                        />
                        <TextField
                            label='Auditor'
                            value={limits.auditor}
                            onChange={(e) => changeHandler(e, 'auditor')}
                            full
                        />
                        <TextField
                            label='Senator'
                            value={limits.senator}
                            onChange={(e) => changeHandler(e, 'senator')}
                            full
                        />
                    </div>

                    <Button primary disabled={loading} classes='flex items-center mt-6 mx-auto' 
                        onClick={sumbitHandler}>
                        {
                            loading && (
                                <svg className='w-6 h-6 mr-2 rotate fill-current inline-block'>
                                    <use href={icons + '#icon-spinner'} />
                                </svg>
                            )
                        }
                        Submit Changes
                    </Button>

                </div>
            </div>
        </div>
    )
}