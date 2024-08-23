

import { Link, useLocation } from "react-router-dom"
import '../../styles/Sidebar.css'
import { useState } from "react"

import { FaTachometerAlt, FaUserGraduate, FaUser, FaGoogle, FaBook, FaComments, FaPeopleArrows } from "react-icons/fa"
import { useSelector } from "react-redux";

export function Sidebar() {
    const location = useLocation();
    const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
    const [isExpanded, setIsExpanded] = useState(true);


    const toggleSideBar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`sidebar ${isExpanded ? 'expand' : 'collapsed'}`}>
            <div className="profile-container">
                {instructor?.profileImage ? (
                    <img src={instructor?.profileImage} alt="Profile" className={`${isExpanded ? 'w-20 h-20 rounded-full ' : 'hidden'} object-cover`} />
                ) : (
                    <p className="flex justify-center items-center bg-zinc-800 text-white w-16 h-16 text-md rounded-full"><FaUser size={20} /></p>
                )}
            </div>
            {isExpanded && <h2 className="">{instructor?.name}</h2>}

            {isExpanded && <h2 className="sidebar-title">VedaByte</h2>}    
            <button onClick={toggleSideBar} className="toggle-button">
                {isExpanded ? '☰' : '>'}
            </button>
            <nav className="sidebar-nav">
                <Link to="/instructor/dashboard" className={`sidebar-link ${location.pathname === '/instructor/dashboard' ? 'active-link' : ''}`}>
                    <FaTachometerAlt />
                    {isExpanded && <span>Dashboard</span>}
                </Link>
                <Link
                    to="/instructor/profile"
                    className={`sidebar-link ${location.pathname === '/instructor/profile' ? 'active-link' : ''}`}
                >
                    <FaUser />
                    {isExpanded ? <span>Profile</span> : ''}
                </Link>
                <Link
                    to="/instructor/students"
                    className={`sidebar-link ${location.pathname === '/instructor/students' ? 'active-link' : ''}`}
                >
                    <FaUserGraduate />
                    {isExpanded ? <span>Students</span> : ''}
                </Link>
                <div className=""  >
                    <Link
                        to="/instructor/courses"
                        className={`sidebar-link ${location.pathname === '/instructor/courses' || location.pathname === '/instructor/addcourse' ? 'active-link' : ''}`}
                    >
                        <FaBook />
                        {isExpanded ? <span className="flex justify-between">Courses</span> : ''}
                    </Link>

                </div>
                <div className=""  >
                    <Link
                        to="/instructor/enrollments"
                        className={`sidebar-link ${location.pathname === '/instructor/enrollments' || location.pathname === '/instructor/enrollments' ? 'active-link' : ''}`}
                    >
                        <FaPeopleArrows />
                        {isExpanded ? <span className="flex justify-between">Enrollments</span> : ''}
                    </Link>

                </div>
                <Link
                    to="/instructor/chat"
                    className={`sidebar-link ${location.pathname === '/instructor/chat' ? 'active-link' : ''}`}
                >
                    <FaComments />
                    {isExpanded ? <span className="flex justify-between">Messages</span> : ''}
                </Link>
                <div className="flex-grow"></div>
                <p className="flex justify-center items-end p-4 mt-72 relative">{<FaGoogle />}</p>
            </nav>
        </div>
    )
}