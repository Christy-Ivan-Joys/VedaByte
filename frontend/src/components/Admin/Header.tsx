import { FaBell } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setAdmin } from '../../utils/redux/slices/adminAuthSlice'

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout=()=>{
        dispatch(setAdmin(null))
        localStorage.removeItem('token')
        navigate('/admin/login')
   }

    return (
        <div className="w-screen/2  h-14 rounded-lg shadow-lg justify-between items-center p-3 flex border-2 ">
            <h1 className="ml-3 text-lg  text-black font-bold text-1xl">Admin</h1>
            <div className=" flex justify-center items-center gap-3 mr-12">
                <div className="profile-container">
                    <img src="" className="justify-end border-8 border-black w-8   rounded-full h-8" alt="" />
                    <div className="dropdown-menu">
                        <Link to="/profile" className="dropdown-item">Profile</Link>
                        <Link to="/logout" className="dropdown-item">Logout</Link>
                    </div>
                </div>
                <Link to="/logout" className="flex items-center text-2xl text-black  rounded-lg p-2 ">
                    <FaBell />
                </Link>
                <button onClick={handleLogout} className="bg-red-400 w-16 h-8 rounded-lg text-white">Logout</button>
            </div>
        </div>
    )
}

export default Header
