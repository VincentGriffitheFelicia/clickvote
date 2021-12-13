import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../img/logo.svg'

import './index.css'

function SideNav() {

    return (
        <nav className='side-nav-container overflow-scroll'>
            <div className='side-nav-logo-container'>
                <img className='side-nav-logo' src={logo} alt="" />
            </div>
            <ul className='side-nav'>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/my-account'>
                        My Account
                    </NavLink>
                </li>
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
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/vice-president'>
                        Vice President
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/secretary'>
                        Secretary
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/treasurer'>
                        Treasurer
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/auditor'>
                        Auditor
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/senator'>
                        Senator
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/my-votes'>
                        My Votes
                    </NavLink>
                </li>
                <li className='side-nav-item'>
                    <NavLink 
                        exact className='side-nav-link' activeClassName='side-nav-link-active' to='/something'>
                        Something
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default SideNav