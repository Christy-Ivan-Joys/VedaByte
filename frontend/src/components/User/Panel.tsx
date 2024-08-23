

import { Link, useLocation } from "react-router-dom"
import '../../styles/panel.css'
import { useState } from "react"
import { FaComments, FaUser, FaGoogle, FaBook, FaCertificate,FaCreditCard, FaReceipt } from "react-icons/fa"
import { useSelector } from "react-redux";

export function Panel() {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);
    const { studentInfo } = useSelector((state: any) => state.userAuth)

    const toggleSideBar = () => {

        setIsExpanded(!isExpanded);
    };


    return (
        <div className={`panel ${isExpanded ? 'expand' : 'collapsed'}`}>
            <div className="profile-container">
                {studentInfo?.profileImage ? (
                    <img src={studentInfo?.profileImage} alt="Profile" className="profile-image" />

                ) : (
                    <p className="flex justify-center items-center bg-zinc-800 w-16 h-16 text-md rounded-full"><FaUser size={20} /></p>
                )}
            </div>
            {isExpanded && <h2 className="panel-title ml-8">VedaByte</h2>}
            <button onClick={toggleSideBar} className="activate-button">
                {isExpanded ? '☰' : '☰'}
            </button>
            <nav className="panel-nav">
                <Link to="/profile" className={`panel-link ${location.pathname === '/profile' ? 'active-link' : ''}`}>
                    <FaUser />
                    {isExpanded && <span>Profile</span>}
                </Link>
                <Link
                    to="/enrolledCourses"
                    className={`panel-link ${location.pathname === '/enrolledCourses' ? 'active-link' : ''}`}
                >
                    <FaBook />
                    {isExpanded ? <span>Courses</span> : ''}
                </Link>
                <Link
                    to="/purchases"
                    className={`panel-link ${location.pathname === '/purchases' || 
                    location.pathname.startsWith('/purchaseDetails/') ? 'active-link' : ''}`}
                >
                    <FaCreditCard />
                    {isExpanded ? <span>Purchases</span> : ''}
                </Link>
                <Link
                    to="/transactions"
                    className={`panel-link ${location.pathname === '/transactions' ? 'active-link' : ''}`}
                >
                    < FaReceipt/>
                    {isExpanded ? <span>Transactions</span> : ''}
                </Link>
                <Link
                    to="/certifications"
                    className={`panel-link ${location.pathname === '/certifications' ? 'active-link' : ''}`}
                >
                    <FaCertificate />
                    {isExpanded ? <span>Certifications</span> : ''}
                </Link>
                <Link
                    to="/chat"
                    className={`panel-link ${location.pathname === '/chat' ? 'active-link' : ''}`}
                >
                    <FaComments />
                    {isExpanded ? <span>Messages</span> : ''}
                </Link>

                <div className="flex-grow"></div>
                <p className="flex justify-center items-end p-4 mt-72 relative">{<FaGoogle />}</p>
            </nav>
        </div>
    )
}