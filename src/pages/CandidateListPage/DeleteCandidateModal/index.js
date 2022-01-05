import React, { useState } from 'react'
import { deleteDoc, doc } from 'firebase/firestore'

import Backdrop from '../../../components/Backdrop'
import Modal from '../../../components/Modal'
import Heading from '../../../components/Heading'
import Error from '../../../components/Error'
import Success from '../../../components/Success'
import Button from '../../../components/Button'

import { db } from '../../../firebase'
import icons from '../../../img/sprites.svg'

export default function ConfirmationModal({ candidateId, candidateName, cancelHandler }) {

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const message = `Are you sure you want to delete "${candidateName}"?`

    const deleteOkHandler = async () => {

        if(deleted) return
            setLoading(true)
        try {

            await deleteDoc(doc(db, 'candidates', candidateId))

            setSuccess(`${candidateName} has been deleted successfully.`)
            setDeleted(true)

        } catch (error) {
            setError(`Failed to delete ${candidateName}.`)
        }
        setLoading(false)
    }

    const closeError = () => setError(null)
    const closeSuccess = () => setSuccess(null)

    return (
        <Backdrop show>
            <Modal>
                <Heading h3 classes='text-center mb-8'>DELETE LIST</Heading>
                { error && <Error onClick={closeError}>{ error }</Error> }
                { success && <Success onClick={closeSuccess}>{ success }</Success> }
                <p className="text-center text-xl font-medium">{ message }</p>
                <div className='grid grid-cols-2 gap-x-4 mt-8'>
                    <Button primary full disabled={loading} classes='bg-main-3 hover:bg-main-4' onClick={cancelHandler}>
                        Close
                    </Button>
                    <Button primary full disabled={(loading || deleted)} classes='flex items-center justify-center' onClick={deleteOkHandler} >
                        { 
                            loading && (
                                <svg className='w-6 h-6 mr-2 rotate fill-current inline-block'>
                                    <use href={icons + '#icon-spinner'} />
                                </svg>
                            ) 
                        }
                        Okay
                    </Button>
                </div>
            </Modal>
        </Backdrop>    
    )
}