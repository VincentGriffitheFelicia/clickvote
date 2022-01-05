import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import './index.css'
function FloatingNav() {

    const candidates = useSelector(state => state.candidates.list)
    const user = useSelector(state => state.userData.user)
    const [checked, setChecked] = useState(false)

    const changeHandler = () => {
        setChecked(!checked)
    }

    return (
        <div className="navigation lg:hidden">
            <input type="checkbox" checked={checked} onChange={changeHandler} className="navigation__checkbox" id="nav-toggle" />
            <label className="navigation__button select-none" for="nav-toggle">
                <span className="navigation__icon">&nbsp;</span>
            </label>
            <div className="navigation__background select-none">&nbsp;</div>

            <nav className="navigation__nav" onClick={() => setChecked(false)}>
                <ul className="navigation__list">
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/summary'>
                            Summary 
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/president'>
                            President
                            ({ candidates['president']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/vice-president-internal'>
                            Vice President Internal
                            ({ candidates['vicePresidentInternal']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/vice-president-external'>
                            Vice President External
                            ({ candidates['vicePresidentExternal']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/secretary'>
                            Secretary
                            ({ candidates['secretary']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/treasurer'>
                            Treasurer
                            ({ candidates['treasurer']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/auditor'>
                            Auditor
                            ({ candidates['auditor']?.length || 0 })
                        </NavLink>
                    </li>
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/senator'>
                            Senator
                            ({ candidates['senator']?.length || 0 })
                        </NavLink>
                    </li>
                    {
                        user.role === 'voter' && (
                            <li className='navigation__item'>
                                <NavLink 
                                    exact className='navigation__link' activeClassName='navigation__link-active' to='/my-votes'>
                                    My Votes
                                </NavLink>
                            </li>
                        )
                    }
                    {
                        user.role === 'admin' && (
                            <li className='navigation__item'>
                                <NavLink 
                                    exact className='navigation__link' activeClassName='navigation__link-active' to='/voting-list'>
                                    Voting List
                                </NavLink>
                            </li>
                        )
                    }
                    {
                        user.role === 'admin' && (
                            <li className='navigation__item'>
                                <NavLink 
                                    exact className='navigation__link' activeClassName='navigation__link-active' to='/voting-limits'>
                                    Voting Limits
                                </NavLink>
                            </li>
                        )
                    }
                    <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/sign-out'>
                            Sign out
                        </NavLink>
                    </li>
                    {/* <li className='navigation__item'>
                        <NavLink 
                            exact className='navigation__link' activeClassName='navigation__link-active' to='/something'>
                            Something
                        </NavLink>
                    </li> */}
                    
                </ul>
            </nav>
        </div>
        
    )
}

export default FloatingNav
