import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'
import validator from 'validator'

import { auth, db } from '../../firebase'
import icons from '../../img/sprites.svg'

import PasswordField from '../../components/PasswordField'
import TextField from '../../components/TextField'
import Select from '../../components/Select'
import Heading from '../../components/Heading'
import Paragraph from '../../components/Paragraph'
import Button from '../../components/Button'
import Link from '../../components/Link'
import Error from '../../components/Error'
import './index.css'

const courseOptions = ['Bachelor of Science in Computer Science', 'Bachelor of Science in Civil Engineering', 'Bachelor of Arts in Economics', 'Bachelor of Arts in English', 'Bachelor of Arts in Filipino', 'Bachelor of Arts in Political Science', 'Bachelor of Arts in Public Administration', 'Bachelor of Science in Biology', 'Bachelor of Science in Environmental Science', 'Bachelor of Science in Mathematics', 'Bachelor of Science in Business Administration major in Financial Management', 'Bachelor of Science in Business Administration major in Human Resource Management', 'Bachelor of Science in Business Administration major in Marketing Management', 'Bachelor of Science in Hospitality Management', 'Bachelor of Early Childhood Education', 'Bachelor of Physical Education', 'Bachelor of Secondary Education major in English', 'Bachelor of Secondary Education major in Filipino', 'Bachelor of Secondary Education major in Science']
const departmentOptions = ['College of Information Technology Education', 'College of Engineering and Technology', 'College of Arts and Sciences', 'College of Business Management', 'College of Teacher Education']
const yearLevelOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year']

function SignupPage() {

    // All states for signup page
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [id, setId] = useState('');
    const [department, setDepartment] = useState('')
    const [course, setCourse] = useState('')
    const [yearLevel, setYearLevel] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)

    // Pattern for validating if name is valid, and pattern for id
    const namePattern = /^(([A-Za-z]+[-']?)*([A-Za-z,]+)?\s)+([A-Za-z]+[-']?)*([A-Za-z]+)?[a-zA-Z]{1}[.]?$/
    const idPattern = /^\d{2}[-]\d{5}$/


    const handleSubmit = async () => {

        setLoading(true)
        const error = []

        // Check if valid email
        if(!validator.isEmail(email)){
            error.push({
                id: 'email',
                message: 'The provided email is not valid.'
            })
        }

        // Check if valid name
        if(!namePattern.test(fullName.trim())) {
            error.push({
                id: 'full-name',
                message: 'The provided name is not valid.'
            })
        } 

        // Check if valid id
        if(!idPattern.test(id)) {
            error.push({
                id: 'student-id',
                message: 'The provided student ID is not valid.'
            })
        }

        // Check if selected department
        if(!department) {
            error.push({
                id: 'department',
                message: 'Please select your department.'
            })
        }

        // Check if selected course
        if(!course) {
            error.push({
                id: 'course',
                message: 'Please select your course.'
            })
        }

        // Check if selected year level
        if(!yearLevel) {
            error.push({
                id: 'year-level',
                message: 'Please select your year level.'
            })
        }

        // Check if password is strong enough
        if(!validator.isStrongPassword(password)) {
            const message = (
                <span>
                    Password is not strong enough. Password should contain at least: <br />
                    <b>1 uppercase</b> <br />
                    <b>1 lowercase</b> <br />
                    <b>1 number</b> <br />
                    <b>1 symbol</b> <br />
                    <b>And with a minimum length of 8 characters</b>
                </span>
            )
            error.push({
                id: 'password',
                message
            })
        }
        // Check if password and repeat password match
        if(password !== repeatPassword) {
             error.push({
                id: 'repeat-password',
                message: 'Passwords doesn\'t match.'
            })
        }

        // If there is no error in validation, start processing the data
        if(error.length === 0) {
            try {

                // Check if the user with the same id already exist
                const usersRef = collection(db, 'users')
                const userQuery = query(usersRef, where('studentId', '==', id))

                const querySnapshot = await getDocs(userQuery)

                if(querySnapshot.docs.length) {
                    error.push({
                        id: 'student-id-duplicate',
                        message: 'A student with the same student ID already exist.'
                    })
                } else {
                    
                    // Check if a user with the same email already exist
                    const { user } = await createUserWithEmailAndPassword(auth, email, password)

                    await setDoc(doc(db, 'users', user.uid), {
                        studentName: fullName,
                        studentId: id,
                        role: 'voter',
                        listsVoted: [],
                        email,
                        department,
                        course,
                        yearLevel,
                        password,
                    })
                    
                    // User has been saved to the database!
                }

            } catch(err) {
                if(err.code === 'auth/email-already-in-use') {
                    error.push({
                        id: 'duplicate-email',
                        message: 'A student with the same email address already exist.'
                    })
                } else {
                    error.push({
                        id: 'other-error',
                        message: 'An error occured while processing your data.'
                    })
                }
            }
        }

        setErrors(error)
        setLoading(false)
    }

    const handleCloseError = (index) => {
        const errorsCopy = [...errors]
        errorsCopy.splice(index, 1)
        setErrors(errorsCopy)
    }

    return (
        <div className='bg-main-2 overflow-y-auto'>
            <div className='min-h-screen py-16 px-6 max-w-2xl mx-auto'>
                <div className='mb-10 text-center md:text-left'>
                    <Heading h3>Sign up</Heading>
                    <Paragraph note>Note: All fields required*</Paragraph>
                </div>

                { errors.length ? (
                    <div className='mb-10'>
                        { 
                            errors.map((err, idx) => (
                                <Error key={err.id} onClick={() => handleCloseError(idx)}>
                                    {err.message}
                                </Error>
                            ))
                        }
                    </div>
                ) : null}
    
                <form className='sign-up-form'>
                    <TextField 
                        placeholder='example@gmail.com' 
                        label='Email'
                        id='email' 
                        value={email}
                        full
                        onChange={(e) => setEmail(e.target.value)} />
                    <TextField 
                        placeholder='Last Name, First Name' 
                        label='Full Name' 
                        id='full-name'
                        value={fullName} 
                        full
                        onChange={(e) => setFullName(e.target.value)} />
                    <TextField 
                        placeholder='xx-xxxxx' 
                        label='ID Number' 
                        id='id-number'
                        value={id}
                        full
                        onChange={(e) => setId(e.target.value)} />
                    <Select 
                        placeholder='Choose...'
                        label='Department' 
                        options={departmentOptions}
                        selected={department}
                        id='department'
                        onClick={(val) => setDepartment(val)} 
                    />
                    <Select 
                        placeholder='Choose...'
                        label='Course' 
                        options={courseOptions}
                        selected={course}
                        id='course'
                        onClick={(val) => setCourse(val)} 
                    />
                    <Select 
                        placeholder='Choose...'
                        label='Year Level' 
                        options={yearLevelOptions}
                        selected={yearLevel}
                        id='year-level'
                        onClick={(val) => setYearLevel(val)} 
                    />
                    <PasswordField 
                        label='Password'
                        id='password'
                        value={password}
                        full
                        onChange={(e) => setPassword(e.target.value)} />
                    <PasswordField 
                        label='Repeat Password'
                        id='repeat-password'
                        value={repeatPassword}
                        full
                        onChange={(e) => setRepeatPassword(e.target.value)} />
                </form>
                <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    primary
                    classes='w-1/2 min-w-max mx-auto block mt-6 mb-10 flex items-center justify-center'>
                    { 
                        loading && (
                            <svg className='w-6 h-6 mr-2 rotate fill-current inline-block'>
                                <use href={icons + '#icon-spinner'} />
                            </svg>
                        ) 
                    }
                    Submit
                </Button>
                <div className='w-3/4 mx-auto border-t border-main-3 text-center pt-6'>
                    <Paragraph info classes='inline mr-2 select-none'>Already have an account?</Paragraph>
                    <Link underlined to='/'>Sign in here</Link>
                </div>
            </div>
        </div>
    )
}

export default SignupPage