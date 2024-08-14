import { Sidebar } from "./Sidebar";
import '../../styles/Dashboard.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setAdmin } from "../../utils/redux/slices/adminAuthSlice";
import { useDispatch } from "react-redux";
import Header from "./Header";
export function Dashboard() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/admin/dashboard')
        } else {
            navigate('/admin/login')
        }
    }, [navigate])
    const handleLogout = () => {
        dispatch(setAdmin(null))
        localStorage.removeItem('token')
        navigate('/admin/login')
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content ">
                <Header />
            </div>
        </div>
    )
}
