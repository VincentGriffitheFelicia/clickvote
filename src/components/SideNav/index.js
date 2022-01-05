import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import logo from '../../img/logo.svg'

import './index.css'

function SideNav() {

    const candidates = useSelector(state => state.candidates.list)
    const user = useSelector(state => state.userData.user)

    return (
        <nav className='side-nav-container overflow-y-scroll'>
            <div className='side-nav-logo-container'>
                <img className='side-nav-logo' src={logo} alt="" />
            </div>
            <ul className='side-nav'>
                {/* <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/my-account'>
                        My Account 
                    </NavLink>
                </li> */}
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/summary'>
                        Summary 
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/president'>
                        President
                        ({ candidates['president']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/vice-president-internal'>
                        Vice President Internal
                        ({ candidates['vicePresidentInternal']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/vice-president-external'>
                        Vice President External
                        ({ candidates['vicePresidentExternal']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/secretary'>
                        Secretary
                        ({ candidates['secretary']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/treasurer'>
                        Treasurer
                        ({ candidates['treasurer']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/auditor'>
                        Auditor
                        ({ candidates['auditor']?.length || 0 })
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/senator'>
                        Senator
                        ({ candidates['senator']?.length || 0 })
                    </NavLink>
                </li>
                {
                    user.role === 'voter' && (
                        <li className='side-nav-item'>
                            <NavLink 
                                exact className='side-nav-link' activeClassName='side-nav-link-active' to='/my-votes'>
                                My Votes
                            </NavLink>
                        </li>
                    )
                }
                {
                    user.role === 'admin' && (
                        <li className='side-nav-item'>
                            <NavLink 
                                exact className='side-nav-link' activeClassName='side-nav-link-active' to='/voting-list'>
                                Voting List
                            </NavLink>
                        </li>
                    )
                }
                {
                    user.role === 'admin' && (
                        <li className='side-nav-item'>
                            <NavLink 
                                exact className='side-nav-link' activeClassName='side-nav-link-active' to='/voting-limits'>
                                Voting Limits
                            </NavLink>
                        </li>
                    )
                }
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/sign-out'>
                        Sign out
                    </NavLink>
                </li>
                {/* <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/something'>
                        Something
                    </NavLink>
                </li> */}
            </ul>
        </nav>
    )
}

export default SideNav