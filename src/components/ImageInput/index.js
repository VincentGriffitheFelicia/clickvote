import React from 'react'
import Paragraph from '../Paragraph'
import icons from '../../img/sprites.svg'
import './index.css'
import Label from '../Label'

function ImageInput({file, id, onChange, label, progress, showProgress}) {
    return (
        <div>
            { label && <Label label={label} id={id} /> }
            <div className='flex items-center'>
                <label htmlFor={id} className='image-input-label w-max min-w-max'>
                    <svg className='w-6 h-6 mr-2 fill-current inline-block'>
                        <use href={icons + '#icon-camera_alt'} />
                    </svg>
                    Choose Photo
                </label>
                <Paragraph classes='ml-2 truncate'>
                    { file ? file.name : 'No photo selected.' }
                </Paragraph>
                <input
                    id={id} 
                    type="file" 
                    accept='image/*' 
                    className='invisible w-0 h-0'
                    onChange={onChange}
                />
            </div>
            {
                (showProgress && file) && (
                    <div className={`flex items-center ${progress !== 100 ? 'animate-pulse' : ''}`}>
                        <div className='bg-main-4 w-full mr-2'>
                            <div className='bg-accent-1' style={{height: 4, width: `${progress}%`}} />
                        </div>
                        <Paragraph classes='text-sm'>{ Math.trunc(progress) }%</Paragraph>
                    </div>
                )
            }
        </div>
    )
}

export default ImageInput
