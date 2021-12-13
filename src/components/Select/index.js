import React, { useState, useRef, useEffect } from 'react'
import SelectButton from './SelectButton'
import SelectMenu from './SelectMenu'
import SelectItem from './SelectItem'
import Label from '../Label'

function Select(props) {

    const [showMenu, setShowMenu] = useState(false)
    const selectRef = useRef()
    
    useEffect(() => {
      
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setShowMenu(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [selectRef])
    
    const handleShowMenu = () => setShowMenu(!showMenu)

    return (
      <div className='select relative' ref={selectRef}>
        { props.label && <Label label={props.label} id={props.id} /> } 
        <SelectButton onClick={handleShowMenu}>
          {props.selected ? props.selected : props.placeholder}
        </SelectButton>
        <SelectMenu show={showMenu}>
          {
            props.options.map(data => (
              <SelectItem key={data} active={(props.selected && data === props.selected) ? true : false}
                onClick={() => {
                  props.onClick(data)
                  handleShowMenu()
                }}
              >
                {data}
              </SelectItem>
            ))
          }
        </SelectMenu>
      </div>
    )
}

export default Select
