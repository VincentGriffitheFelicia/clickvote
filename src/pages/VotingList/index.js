import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { doc, addDoc, getDocs, where, deleteDoc, collection, query, onSnapshot, orderBy, updateDoc, serverTimestamp, writeBatch } from "firebase/firestore";

import Backdrop from '../../components/Backdrop';
import Modal from '../../components/Modal';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Error from '../../components/Error'
import Success from '../../components/Success'
import Heading from '../../components/Heading';

import { db } from '../../firebase'

import './index.css'
import icons from '../../img/sprites.svg'
import { AnimatePresence } from 'framer-motion';

function VotingList() {

    const history = useHistory()

    const [votingList, setVotingList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [editModalData, setEditModalData] = useState(null)
    const [deleteModalData, setDeleteModalData] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)

    const activeCandidateList = useSelector(state => state.controlData.activeCandidateList)

    const fetchData = () => {

        setLoading(true)
        const q = query(collection(db, 'candidateList'), orderBy('createdAt', 'desc'))

        const unsubscribeCandidates = onSnapshot(q, (querySnapshot) => {
            const data = []
            querySnapshot.forEach((doc) => {
                data.push({
                    id:doc.id,
                    ...doc.data()
                })
            });
            setVotingList(data)
            setLoading(false)
        }, (error) => setError(error))

        return unsubscribeCandidates                
    }

    useEffect(() => {

        const unsubscribe = fetchData()

        return () => {
            unsubscribe()
            setVotingList([])
            setEditModalData(null)
            setDeleteModalData(null)
        }
    }, [])

    const changeActiveVotingList = async (e, id) => {

        e.stopPropagation()

        let active

        if (id === activeCandidateList) {
            // Set to empty
            active = ''
        } else {
            // Set the id as the new active id
            active = id
        }

        try {
            const ref = doc(db, 'controls', 'rBKfRL1VLoGO2eakapDy')
            await updateDoc(ref, { activeCandidateList: active })
        } catch(err) {
            setError('Failed to change active list.')
        }

    }

    const redirect = (id) => {
        history.push(`/voting-list/${id}`)
    }

    // For edit list item
    const openEditModal = (e, id, title, schoolYear, description) => {
        e.stopPropagation()

        setEditModalData({ id, title, schoolYear, description })
    }

    const closeEditModal = (e) => {
        e.stopPropagation()
        setEditModalData(null)
    }

    // For deleting list item
    const openDeleteModal = (e, id, title) => {
        e.stopPropagation()
        setDeleteModalData({
            id,
            title,
            message: `Are you sure you want to delete "${title}" and all of the candidates added in this list?`
        })
    }

    const deleteCancelHandler = () => {
        setDeleteModalData(null)
    }

    // For adding a list
    const openAddVotingListModal = () => setShowAddModal(true)
    const closeAddVotingListModal = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowAddModal(false)
    }

    return (
        <div className='voting-list-page-container'>
            <AnimatePresence>
                { editModalData && (
                    <EditListModal editModalData={editModalData} closeHandler={closeEditModal} />
                )}
                { deleteModalData && (
                <ConfirmationModal 
                    message={deleteModalData.message} 
                    deleteModalData={deleteModalData}
                    cancelHandler={deleteCancelHandler}
                    />
                )}
                { showAddModal && (
                    <AddVotingList 
                        closeHandler={closeAddVotingListModal}
                    />
                )}
                
            </AnimatePresence>
        
            <div className='pt-14 pb-6 lg:p-12'>
                <div className='bg-main-2 px-8 pt-8 pb-12 lg:px-10 lg:pt-10 lg:pb-14 rounded-xl overflow-x-auto'>

                    <div className='block lg:flex items-center'>
                        <div className='mr-auto'>
                            <h3 className='font-bold text-2xl text-main-8 uppercase' style={{letterSpacing: 1}}>
                                VOTING LIST
                            </h3>
                            <h4 className='font-medium text-xl text-main-7'>
                                These are the voting lists for SSG Elections.
                            </h4>
                        </div>
                        <Button primary classes='flex items-center block mt-6 lg:mt-0' onClick={openAddVotingListModal}>
                            <svg className='w-6 h-6 fill-current inline-block'>
                                <use href={icons + '#icon-add'} />
                            </svg>
                            Add
                        </Button>
                    </div>

                    <div>

                        {/* Header */}
                        <div className='voting-list-layout mt-8 py-2 px-4 items-center gap-x-6'>
                            <h5 className='font-medium text text-main-5 uppercase'>#</h5>
                            <h5 className='font-medium text text-main-5 uppercase'>TITLE</h5>
                            <h5 className='font-medium text text-main-5 uppercase text-center hidden bp-1120:block '>S.Y.</h5>
                            <h5 className='font-medium text text-main-5 uppercase text-right'>ACTION</h5>
                        </div>
                        

                        {/* LIST */}
                        { votingList.length ? votingList.map((list, idx) => (
                            <div 
                            className='voting-list-layout p-4 items-center gap-x-6 hover:bg-main-3 border-b border-main-5 cursor-pointer w-full' 
                            key={list.id} 
                            onClick={() => redirect(list.id)}>
                                <h5 className='font-bold text-l text-main-5'>{ idx + 1}</h5>
                                <div className='overflow-hidden'>
                                    <h5 className='font-bold text-xl text-main-7 truncate'>
                                        { list.title }
                                    </h5>
                                    <h5 className='font-medium text-l text-main-5 truncate'>
                                        { list.description }
                                    </h5>
                                </div>
                                <h5 className='font-medium text-xl text-main-5 justify-self-center hidden bp-1120:block text-center'>
                                    { list.schoolYear }
                                </h5>
                            <div className='justify-self-end grid grid-cols-3 gap-x-2 text-main-2'>
                                    <button 
                                        className={`rounded-full p-2 flex-shrink-0 ${ list.id === activeCandidateList ? 'bg-accent-1 hover:bg-accent-2' : 'bg-main-6 hover:bg-main-7' }`}
                                        onClick={(e) => changeActiveVotingList(e, list.id)}>
                                        <svg className='fill-current w-4 h-4'>
                                            <use href={ icons + '#icon-check' }/>
                                        </svg>
                                    </button>
                                    <button className="rounded-full p-2 flex-shrink-0 bg-main-6 hover:bg-main-7"
                                        onClick={(e) => openEditModal(e, list.id, list.title, list.schoolYear,  list.description)}>
                                        <svg className='fill-current w-4 h-4'>
                                            <use href={ icons + '#icon-edit' }/>
                                        </svg>
                                    </button>
                                    <button className="rounded-full p-2 flex-shrink-0 bg-main-6 hover:bg-main-7"
                                        onClick={(e) => openDeleteModal(e, list.id, list.title)}>
                                        <svg className='fill-current w-4 h-4'>
                                            <use href={ icons + '#icon-trash-2' }/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : null }

                    </div>

                </div>

            </div>
        </div>
    )
}

function EditListModal(props) {

    const [editModalData, setEditModalData] = useState({ ...props.editModalData })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        return () => {
            setEditModalData(null)
        }
    }, [])

    const handleEditList = async (e) => {

        e.preventDefault()

        setLoading(true)

        try {
            const ref = doc(db, 'candidateList', editModalData.id)
            await updateDoc(ref, { 
                title: editModalData.title,
                schoolYear: editModalData.schoolYear,
                description: editModalData.description
            })
            setSuccess('Successfuly updated!')
        } catch(err) {
            setError('Failed to update!')
        }

        setLoading(false)
    }

    const changeHandler = (e, prop) => {
        setEditModalData({
            ...editModalData,
            [prop]: e.target.value
        })
    }

    const closeError = () => setError(null)
    const closeSuccess = () => setSuccess(null)

    return (
        <Backdrop show>
            <Modal>
                <Heading h3 classes='text-center mb-8'>EDIT LIST</Heading>
                { error && <Error onClick={closeError}>{ error }</Error> }
                { success && <Success onClick={closeSuccess}>{ success }</Success> }
                <form onSubmit={handleEditList}>
                    <TextField
                        placeholder='Title'
                        value={editModalData.title}
                        className='mb-4'
                        onChange={(e) => changeHandler(e, 'title')}
                        full
                    />
                    <TextField
                        placeholder='School Year'
                        value={editModalData.schoolYear}
                        className='mb-4'
                        onChange={(e) => changeHandler(e, 'schoolYear')}
                        full
                    />
                    <textarea 
                        className='text-field block resize-none' 
                        placeholder='Description'
                        rows={5} 
                        value={editModalData.description}
                        onChange={(e) => changeHandler(e, 'description')}
                    />
                    <div className='grid grid-cols-2 gap-x-4 mt-4'>
                        <Button primary full disabled={loading} classes='bg-main-3 hover:bg-main-4' onClick={props.closeHandler}>
                            Close
                        </Button>
                        <Button primary full disabled={loading} classes='flex items-center justify-center'>
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
                </form>
            </Modal>
        </Backdrop>
    )
}

function ConfirmationModal(props) {

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [loading, setLoading] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const deleteOkHandler = async () => {
        if(deleted) return
        setLoading(true)
        try {

            const batch = writeBatch(db);
            const q = query(collection(db, "candidates"), where("candidateListId", "==", props.deleteModalData.id));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((docSnap) => {
                const ref = doc(db, "candidates", docSnap.id);
                batch.delete(ref)
            });

            const listRef = doc(db, 'candidateList', props.deleteModalData.id)
            batch.delete(listRef)

            await batch.commit()

            setSuccess(`${props.deleteModalData.title} has been deleted successfully.`)
            setDeleted(true)
        } catch (error) {
            setError('Failed to delete')
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
                <p className="text-center text-xl font-medium">{ props.message }</p>
                <div className='grid grid-cols-2 gap-x-4 mt-8'>
                    <Button primary full disabled={loading} classes='bg-main-3 hover:bg-main-4' onClick={props.cancelHandler}>
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

function AddVotingList(props) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        schoolYear: '',
        description: ''
    })

    const closeError = () => setError(null)
    const closeSuccess = () => setSuccess(null)

    const changeHandler = (e, key) => {
        setFormData({
            ...formData,
            [key]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {

        setLoading(true)
        e.preventDefault()

        try {

            if(formData.title === '' || formData.schoolYear === '' || formData.description === '') {
                setError('Please enter all of the required data.')
                setLoading(false)
                return
            }

            await addDoc(collection(db, 'candidateList'), {
                ...formData,
                createdAt: serverTimestamp()
            })
            setSuccess('Entry successfully added.')
        } catch (err) {
            setError('Failed to add!')
        }

        setLoading(false)
    } 

    return (
        <Backdrop show>
            <Modal>
                <Heading h3 classes='text-center mb-8'>ADD VOTING LIST</Heading>
                { error && <Error onClick={closeError}>{ error }</Error> }
                { success && <Success onClick={closeSuccess}>{ success }</Success> }
                <form onSubmit={handleSubmit}>
                    <TextField
                        placeholder='Title'
                        value={formData.title}
                        className='mb-4'
                        onChange={(e) => changeHandler(e, 'title')}
                        full
                    />
                    <TextField
                        placeholder='School Year'
                        value={formData.schoolYear}
                        className='mb-4'
                        onChange={(e) => changeHandler(e, 'schoolYear')}
                        full
                    />
                    <textarea 
                        className='text-field block resize-none' 
                        placeholder='Description'
                        rows={5} 
                        value={formData.description}
                        onChange={(e) => changeHandler(e, 'description')}
                    />
                    <div className='grid grid-cols-2 gap-x-4 mt-4'>
                        <Button primary full disabled={loading} classes='bg-main-3 hover:bg-main-4' onClick={props.closeHandler}>
                            Close
                        </Button>
                        <Button primary full disabled={loading} classes='flex items-center justify-center'>
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
                </form>
            </Modal>
        </Backdrop>
    )
}

export default VotingList