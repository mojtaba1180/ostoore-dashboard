import React, {useRef, useState, useLayoutEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'

import './sidebar.css'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'




const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}






const Sidebar = props => {
    // const authUser = React.createContext(false)
    const [isLogin, setIsLogin] = useState(false);
    const { pathname } = useLocation();
    useLayoutEffect(() => {
      if (pathname === "/login") {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    }, [pathname]);
    const sidebar_toggle_ref = useRef(null)

    const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const toggleMenu = () => {
        sidebar_toggle_ref.current.classList.toggle('active')
    }
    return (
        <div className={isLogin ? 'hidden' :'sidebar'} ref={sidebar_toggle_ref}>
             <button className="sidebar_button" onClick={() => toggleMenu()}>
                <i className='bx bx-menu'></i>
            </button>
            {/* <div className="sidebar__logo">
                <img src="/assets/images/Logo.png" alt="company logo" />
            </div> */}
            <div className="sidebar_items">
            {
                sidebar_items.map((item, index) => (
                    <Link to={item.route} key={index}>
                        <SidebarItem
                            title={item.display_name}
                            icon={item.icon}
                            active={index === activeItem}
                        />
                    </Link>
                ))
            }
            </div>
            
        </div>
    )
}

export default Sidebar
