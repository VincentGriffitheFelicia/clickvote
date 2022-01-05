import React from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect } from 'react';
import { useState } from 'react';
import { nanoid } from 'nanoid'

import { db, storage } from '../../../firebase'
import Button from '../../../components/Button';
import icons from '../../../img/sprites.svg'
import Backdrop from '../../../components/Backdrop';
import Modal from '../../../components/Modal';
import Heading from '../../../components/Heading';
import Error from '../../../components/Error';
import Success from '../../../components/Success'
import TextField from '../../../components/TextField';
import Select from '../../../components/Select'
import ImageInput from '../../../components/ImageInput';
import TextArea from '../../../components/TextArea';

// SELECT OPTIONS
const positionOptions = ['President', 'Vice President Internal', 'Vice President External', 'Secretary', 'Treasurer', 'Auditor', 'Senator']
const genderOptions = ['Male', 'Female']
const courseOptions = ['Bachelor of Science in Computer Science', 'Bachelor of Science in Civil Engineering', 'Bachelor of Arts in Economics', 'Bachelor of Arts in English', 'Bachelor of Arts in Filipino', 'Bachelor of Arts in Political Science', 'Bachelor of Arts in Public Administration', 'Bachelor of Science in Biology', 'Bachelor of Science in Environmental Science', 'Bachelor of Science in Mathematics', 'Bachelor of Science in Business Administration major in Financial Management', 'Bachelor of Science in Business Administration major in Human Resource Management', 'Bachelor of Science in Business Administration major in Marketing Management', 'Bachelor of Science in Hospitality Management', 'Bachelor of Early Childhood Education', 'Bachelor of Physical Education', 'Bachelor of Secondary Education major in English', 'Bachelor of Secondary Education major in Filipino', 'Bachelor of Secondary Education major in Science']
const departmentOptions = ['College of Information Technology Education', 'College of Engineering and Technology', 'College of Arts and Sciences', 'College of Business Management', 'College of Teacher Education']
const yearLevelOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export default function AddCandidateModal(props) {

    const [candidateData, setCandidateData] = useState({
        candidateListId: props.candidateListId,
        course: '',
        department: '',
        gender: '',
        goal: '',
        name: '',
        position: '',
        yearLevel: '',
    })

    const [imageInputs, setImageInputs] = useState({
        bannerPic: null,
        profilePic: null,
    })

    const [progress, setProgress] = useState({
        bannerPic: 0,
        profilePic: 0,
    })
    const [showProgress, setShowProgress] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)    

    useEffect(() => {

        return () => {
            setCandidateData(null)
        }
    }, [])

    const uploadImage = (imageFile, candidateId, key) => {

        return new Promise((resolve, reject) => {

            const storageRef = ref(storage, `${candidateId}/${imageFile.name.split(' ').join('_')}`)
            const uploadTask = uploadBytesResumable(storageRef, imageFile)

            uploadTask.on('state_changed', (snapshot) => {

                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setProgress((val) => ({ ...val, [key]: p }))

            }, () => {
                reject('Failed to upload files! Please try again.')
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    resolve(downloadURL)
                })
            })
        })
    }

    const handleEditCandidate = async (e) => {
        
        try {

            setLoading(true)

            let imageURL = {  }
            const id = nanoid()

            // CHECK IF ALL THE FIELDS ARE FILLED UP
            for (const key of Object.keys(candidateData)) {
                if(!candidateData[key]) {
                    setLoading(false)
                    setError('Please fill up all of the fields.')
                    return
                } 
            }

            // CHECK IF THE IMAGES ARE FILLED
            if(!imageInputs.bannerPic || !imageInputs.profilePic) {
                setLoading(false)
                setError('Please choose a photo.')
                return
            }

            // SHOW THE PROGRESS AS WE CAN NOW UPLOAD OUR IMAGE
            setShowProgress(true)

            // Upload the image first
            const profilePicURL = await uploadImage(imageInputs.profilePic, id, 'profilePic')
            imageURL = { ...imageURL, profilePic: profilePicURL }

            const bannerPicURL = await uploadImage(imageInputs.bannerPic, id, 'bannerPic')
            imageURL = { ...imageURL, bannerPic: bannerPicURL }

            const dataToUpload = {
                ...candidateData,
                ...imageURL,
                position: sentenceToCamel(candidateData.position),
                totalVotes: 0,
            }

            const ref = doc(db, "candidates", id);
            await setDoc(ref, dataToUpload)

            setLoading(false)
            setSuccess('Candidate created successfully.')
            setShowProgress(false)
            setProgress({
                profilePic: 0,
                bannerPic: 0
            })

        } catch(err) {
            setError('Failed to upload candidate data! Please try again.')
            setLoading(false)
            setShowProgress(false)
            setProgress({
                profilePic: 0,
                bannerPic: 0
            })
        }
    }

    const changeHandler = (e, prop) => {
        setCandidateData({
            ...candidateData,
            [prop]: e.target.value
        })
    }

    const selectHandler = (val, prop) => {
        setCandidateData({
            ...candidateData,
            [prop]: val
        })
    }

    function fileChangeHandler(e, key) {
        const pattern = /image-*/;
        let file

        if (e.target.files[0]) {
            file = e.target.files[0];

            if (file.type.match(pattern)) {
                setImageInputs({
                    ...imageInputs,
                    [key]: file
                })
            }
        } else {
            setImageInputs({
                ...imageInputs,
                [key]: null
            })
        }
    }

    function sentenceToCamel (text) {
        const result = text.split(' ').join('').trim()
        return result.charAt(0).toLowerCase() + result.slice(1);
    }

    const closeError = () => setError(null)
    const closeSuccess = () => setSuccess(null)

    return (
        <Backdrop show>
            <Modal>
                <Heading h3 classes='text-center mb-8'>CREATE CANDIDATE</Heading>
                
                <div className='grid grid-cols-1 gap-y-4'>
                    <TextField
                        placeholder='Name'
                        value={candidateData.name}
                        onChange={(e) => changeHandler(e, 'name')}
                        full
                    />
                    <Select
                        placeholder='Position'
                        options={positionOptions}
                        selected={candidateData.position}
                        id='position'
                        onClick={(val) => selectHandler(val, 'position')} 
                    />
                    <Select 
                        placeholder='Gender'
                        options={genderOptions}
                        selected={candidateData.gender}
                        id='gender'
                        onClick={(val) => selectHandler(val, 'gender')} 
                    />
                    <Select
                        placeholder='Course'
                        options={courseOptions}
                        selected={candidateData.course}
                        id='course'
                        onClick={(val) => selectHandler(val, 'course')} 
                    />
                    <Select
                        placeholder='Department'
                        options={departmentOptions}
                        selected={candidateData.department}
                        id='department'
                        onClick={(val) => selectHandler(val, 'department')} 
                    />
                    <Select
                        placeholder='Year Level'
                        options={yearLevelOptions}
                        selected={candidateData.yearLevel}
                        id='year-level'
                        onClick={(val) => selectHandler(val, 'yearLevel')} 
                    />
                    <TextArea
                        id='goal'
                        placeholder='Goal'
                        value={candidateData.goal}
                        onChange={(e) => changeHandler(e, 'goal')}
                    />
                    <ImageInput 
                        label='Profile Picture'
                        file={imageInputs.profilePic} 
                        id='profile-pic'
                        showProgress={showProgress}
                        progress={progress.profilePic}
                        onChange={(e) => fileChangeHandler(e, 'profilePic')}
                    />
                    <ImageInput 
                        label='Banner Picture'
                        file={imageInputs.bannerPic} 
                        id='banner-pic'
                        showProgress={showProgress}
                        progress={progress.bannerPic}
                        onChange={(e) => fileChangeHandler(e, 'bannerPic')}
                    />

                    {
                        (error || success) && (
                            <div className='mt-4'>
                                { error && <Error onClick={closeError}>{ error }</Error> }
                                { success && <Success onClick={closeSuccess}>{ success }</Success> }
                            </div>
                        ) 
                    }

                    <div className='grid grid-cols-2 gap-x-4 mt-4'>
                        <Button primary full disabled={loading} classes='bg-main-3 hover:bg-main-4' onClick={props.closeHandler}>
                            Close
                        </Button>
                        <Button primary full disabled={loading} classes='flex items-center justify-center' onClick={handleEditCandidate}>
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
                </div>
            </Modal>
        </Backdrop>
    )
}