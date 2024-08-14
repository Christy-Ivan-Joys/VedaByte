import { Sidebar } from "./Sidebar";
import '../../styles/Dashboard.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
export function Dashboard() {

    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/admin/dashboard')
        } else {
            navigate('/admin/login')
        }
    }, [navigate])


    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content ">
                <Header />
            </div>
        </div>
    )
}
