import React, { useState, useEffect } from 'react'
import { doc, updateDoc} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

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

export default function EditCandidateModal(props) {

    const [editCandidateData, setEditCandidateData] = useState({ 
        ...props.editCandidateData,
        position: camelToSentence(props.editCandidateData.position)
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
            setEditCandidateData(null)
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
            setShowProgress(true)

            const originalData = { ...props.editCandidateData }
            let changedData = {  }
            let imageURL = {  }

            // Upload the image first
            if(imageInputs.profilePic) {
                const downloadURL = await uploadImage(imageInputs.profilePic, originalData.id, 'profilePic')
                imageURL = { ...imageURL, profilePic: downloadURL }
            }

            if(imageInputs.bannerPic) {
                const downloadURL = await uploadImage(imageInputs.bannerPic, originalData.id, 'bannerPic')
                imageURL = { ...imageURL, bannerPic: downloadURL }
            }

            // Check and save data changes
            for (const key of Object.keys(originalData)) {

                let toCheck = editCandidateData[key]

                if(key === 'position') toCheck = sentenceToCamel(toCheck)

                if(originalData[key] !== toCheck) {
                    changedData[key] = toCheck
                }
            }

            changedData = {
                ...changedData,
                ...imageURL
            }

            if(!Object.keys(changedData).length) {
                setLoading(false)
                setSuccess('No data has been changed. No need to update.')
                setShowProgress(false)
                setProgress({
                    profilePic: 0,
                    bannerPic: 0
                })
                return
            }

            const ref = doc(db, "candidates", editCandidateData.id);

            // Update candidate data with the changedData
            await updateDoc(ref, changedData);

            setLoading(false)
            setSuccess('Updated successfully.')
            setShowProgress(false)
            setProgress({
                profilePic: 0,
                bannerPic: 0
            })

        } catch(err) {
            setError('Failed to update! Please try again.')
            setLoading(false)
            setShowProgress(false)
            setProgress({
                profilePic: 0,
                bannerPic: 0
            })
        }
    }

    const changeHandler = (e, prop) => {
        setEditCandidateData({
            ...editCandidateData,
            [prop]: e.target.value
        })
    }

    const selectHandler = (val, prop) => {
        setEditCandidateData({
            ...editCandidateData,
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

    function camelToSentence (text) {
        const result = text.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
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
                <Heading h3 classes='text-center mb-8'>EDIT CANDIDATE</Heading>
                
                <div className='grid grid-cols-1 gap-y-4'>
                    <TextField
                        label='Name'
                        placeholder='Name'
                        value={editCandidateData.name}
                        onChange={(e) => changeHandler(e, 'name')}
                        full
                    />
                    <Select
                        label='Position' 
                        placeholder='Position'
                        options={positionOptions}
                        selected={editCandidateData.position}
                        id='position'
                        onClick={(val) => selectHandler(val, 'position')} 
                    />
                    <Select 
                        label='Gender'
                        placeholder='Gender'
                        options={genderOptions}
                        selected={editCandidateData.gender}
                        id='gender'
                        onClick={(val) => selectHandler(val, 'gender')} 
                    />
                    <Select
                        label='Course' 
                        placeholder='Course'
                        options={courseOptions}
                        selected={editCandidateData.course}
                        id='course'
                        onClick={(val) => selectHandler(val, 'course')} 
                    />
                    <Select
                        label='Department' 
                        placeholder='Department'
                        options={departmentOptions}
                        selected={editCandidateData.department}
                        id='department'
                        onClick={(val) => selectHandler(val, 'department')} 
                    />
                    <Select
                        label='Year Level'
                        placeholder='Year Level'
                        options={yearLevelOptions}
                        selected={editCandidateData.yearLevel}
                        id='year-level'
                        onClick={(val) => selectHandler(val, 'yearLevel')} 
                    />
                    <TextArea
                        id='goal'
                        label='Goal' 
                        placeholder='Goal'
                        value={editCandidateData.goal}
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
                        Edit
                        </Button>
                    </div>
                </div>
            </Modal>
        </Backdrop>
    )
}