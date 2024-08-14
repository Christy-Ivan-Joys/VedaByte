import { Link, useLocation } from "react-router-dom"
import '../../styles/Sidebar.css'
import { useState } from "react"
import { FaTachometerAlt,FaFolder, FaUserGraduate, FaGoogle, FaChalkboardTeacher,FaEnvelopeSquare,FaUser } from "react-icons/fa"

export function Sidebar() {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSideBar = () => {
        setIsExpanded(!isExpanded);
    };


    return (
        <div className={`sidebar ${isExpanded ? 'expand' : 'collapsed'}`}>
            <div className="profile-container">
                <FaUser/>
            </div>
            {isExpanded && <h2 className="sidebar-title ml-8">VedaByte</h2>}
            <button onClick={toggleSideBar} className="toggle-button">
                {isExpanded ? '☰' : '>'}
            </button>
            <nav className="sidebar-nav">
                <Link to="/admin/dashboard" className={`sidebar-link ${location.pathname === '/admin/dashboard' ? 'active-link' : ''}`}>
                    <FaTachometerAlt />
                    {isExpanded && <span>Dashboard</span>}
                </Link>
                <Link
                    to="/admin/tutors"
                    className={`sidebar-link ${location.pathname === '/admin/tutors' ? 'active-link' : ''}`}
                >
                    <FaChalkboardTeacher />
                    {isExpanded ? <span>Instructors</span> : ''}
                </Link>
                <Link
                    to="/admin/students"
                    className={`sidebar-link ${location.pathname === '/admin/students' ? 'active-link' : ''}`}
                >
                    <FaUserGraduate />
                    {isExpanded ? <span>Students</span> : ''}
                </Link>
                <Link
                    to="/admin/applications"
                    className={`sidebar-link ${location.pathname === '/admin/applications' || location.pathname==='/admin/applicationDetails' ? 'active-link' : ''}`}
                >
                    <FaEnvelopeSquare />
                    {isExpanded ? <span>Applications</span> : ''}
                </Link>
                <Link
                    to="/admin/category"
                    className={`sidebar-link ${location.pathname === '/admin/category' || location.pathname==='/admin/category' ? 'active-link' : ''}`}
                >
                    <FaFolder/>
                    {isExpanded ? <span>Category</span> : ''}
                </Link>
                {/* <Link
                    to="/admin/notifications"
                    className={`sidebar-link ${location.pathname === '/admin/notifications' ? 'active-link' : ''}`}
                >
                    <FaBell />
                    {isExpanded ? <span>Notifications</span> : ''}
                </Link> */}
                <div className="flex-grow"></div>
                <p className="flex justify-center items-end p-4 mt-72 relative">{<FaGoogle />}</p>
               
            </nav>
        </div>
    )
}