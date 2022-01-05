import React, { useCallback } from 'react'
import { useParams } from 'react-router'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useState } from 'react';

import { db } from '../../firebase'
import icons from '../../img/sprites.svg'
import './index.css'

import WarningBanner from '../../components/WarningBanner'
import Button from '../../components/Button';
import VoteInfoBar from '../../components/VoteInfoBar';
import CandidateCardList from '../../components/CandidateCardList';
import EditCandidateModal from './EditCandidateModal'
import AddCandidateModal from './AddCandidateModal';
import DeleteCandidateModal from './DeleteCandidateModal'

export default function CandidateListPage() {

    const { id } = useParams()
    const [error, setError] = useState(null)
    const [listInfoIsLoaoded, setListInfoIsLoaded] = useState(false)
    const [candidatesIsLoaded, setCandidatesIsLoaded] = useState(false)
    
    const [listInfo, setListInfo] = useState({})
    const [candidates, setCandidates] = useState({})

    const [editCandidateData, setEditCandidateData] = useState(null)
    const [showAddCandidateModal, setShowAddCandidateModal] = useState(false)
    const [deleteCandidateData, setDeleteCandidateData] = useState(null)
    
    const order = ['president', 'vicePresidentInternal', 'vicePresidentExternal', 'secretary', 'treasurer', 'auditor', 'senator']

    const fetchListInfo = useCallback(
        () => {
            // GET THE LIST DATA
            setListInfoIsLoaded(false)
            return onSnapshot(doc(db, "candidateList", id), 
            (doc) => {
                setListInfo(doc.data())
                setListInfoIsLoaded(true)
            },
            (error) => {
                setError('Failed to fetch data. Please try again!')
                setListInfoIsLoaded(false)
            });
        }, [id]
    )

    const fetchCandidates = useCallback(
        () => {
            // GET THE CANDIDATES
            setCandidatesIsLoaded(false)
            const q = query(collection(db, 'candidates'), where('candidateListId', '==', id))
            return onSnapshot(q, (querySnapshot) => {

                let currentData = []
                querySnapshot.forEach((doc) => {
                    currentData.push({
                        ...doc.data(),
                        id: doc.id,
                    })
                });

                const candidates = currentData.reduce((prev, curr) => {
                    prev[curr.position] = prev[curr.position] || []
                    prev[curr.position].push(curr)
                    return prev
                }, {})

                setCandidates(candidates)
                setCandidatesIsLoaded(true)
            }, (error) => {
                setError('Failed to fetch candidates! Please try again.')
                setCandidatesIsLoaded(false)
            });
        }, [id]
    )

    useEffect(() => {

        const unsubListInfo = fetchListInfo()
        const unsubCandidates = fetchCandidates()
        
        return () => {
            unsubListInfo()
            unsubCandidates()
        }
    }, [fetchCandidates, fetchListInfo])

    const getPositionText = (position) => {
        if(position === 'vicePresidentInternal') return 'Vice President Internal'
        else if(position === 'vicePresidentExternal') return 'Vice President External'
        else return position
    }

     const editCandidate = (candidate) => {
        setEditCandidateData(candidate)
    }

    const closeEditModal = () => {
        setEditCandidateData(null)
    }

    const deleteCandidate = (candidate) => {
        setDeleteCandidateData({
            candidateId: candidate.id,
            candidateName: candidate.name
        })
    }

    const closeDeleteModal = () => {
        setDeleteCandidateData(null)
    }

    const closeAddModal = () => setShowAddCandidateModal(false)

    const renderCandidates = () => {
        let elements = []

        if(Object.keys(candidates).length === 0 && candidatesIsLoaded) {
            elements.push(
                <div key={'warning-banner'} className='w-full flex justify-center items-center pb-8'>
                    <WarningBanner 
                        message='No candidates found in this list!'
                    />
                </div>
            )
        } 
        
        order.forEach(pos => {
            
            candidates[pos] && candidates[pos].length && (
                elements.push(
                    <React.Fragment key={pos}>
                        <VoteInfoBar
                            position = { getPositionText(pos) } 
                            hideVoteCount
                        />
                        <CandidateCardList
                            className = 'pb-8' 
                            candidates = { candidates[pos] }
                            hideVoteBtn = { true }
                            adminControls = { true }
                            onEdit = { editCandidate }
                            onDelete = { deleteCandidate }
                        />
                    </React.Fragment>
                )
            )
        })

        return elements
    }

    return (
        <div className='candidate-list-page-container'>
            <AnimatePresence>
                { editCandidateData && (
                    <EditCandidateModal 
                        editCandidateData={editCandidateData} 
                        closeHandler={closeEditModal} 
                    />
                )}

                { showAddCandidateModal && (
                    <AddCandidateModal 
                        closeHandler = { closeAddModal }
                        candidateListId = { id }
                    />
                ) }


                { deleteCandidateData && (
                    <DeleteCandidateModal 
                        cancelHandler = {closeDeleteModal}
                        { ...deleteCandidateData }
                    />
                ) }
                
            </AnimatePresence>
            {
                Object.keys(listInfo).length !== 0 && (
                    <div className='mb-4 lg:mb-0 lg:px-6 lg:py-8'>
                        <div className='bg-main-2 px-10 pb-10 pt-20 lg:pt-10 lg:rounded-xl overflow-x-auto'>
                            <h3 className='font-bold text-2xl text-main-8 uppercase' style={{letterSpacing: 1}}>
                                { listInfo.title }
                            </h3>
                            <h4 className='font-medium text-xl text-main-7 uppercase'>
                                { listInfo.schoolYear }
                            </h4>
                            <p className='mt-4 text-main-6'>
                                { listInfo.description }
                            </p>
                            <Button primary classes='flex items-center mt-4' 
                                onClick={() => setShowAddCandidateModal(true)}>
                                <svg className='w-6 h-6 fill-current inline-block'>
                                    <use href={icons + '#icon-add'} />
                                </svg>
                                Add Candidate
                            </Button>
                        </div>
                    </div>
                )
            }
            {
                renderCandidates()
            }
        </div>
    )
}