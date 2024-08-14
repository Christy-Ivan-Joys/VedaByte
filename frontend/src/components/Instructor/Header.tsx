import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { setInstructor } from "../../utils/redux/slices/instructorAuthSlice"
import { useDispatch, useSelector } from "react-redux"
import { MdLogout } from 'react-icons/md';
import Cookies from "js-cookie";
import { useState } from "react";


export const Header = () => {
    const dispatch = useDispatch()
    const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
    const [isModal, setIsModal] = useState(false)

    const navigate = useNavigate()
    const handleLogout = () => {

        const InsLogout = async () => {
            Cookies.remove('InstructorAccessToken', { path: '/' })
            Cookies.remove('InstructorRefreshToken', { path: '/' })
        }
        InsLogout()
        dispatch(setInstructor(null))
        navigate('/instructor/login')
    }


    return (

        <div className="w-screen/2  h-14 rounded-lg shadow-xl justify-between items-center p-3 flex  bg-white">
            <h1 className="ml-3 text-lg  text-black font-semibold text-1xl"></h1>
            <div className=" flex justify-center items-center gap-5">
                {instructor?.profileImage ? (
                    <img src={instructor?.profileImage} className="justify-end w-8  mr-5 rounded-full h-8 object-cover" alt="" />
                ) : (
                    <p className="flex justify-center items-center bg-zinc-800 text-white w-10 h-10 text-md rounded-full"><FaUser size={15} /></p>
                )}
                <p className="cursor-pointer" onClick={() => setIsModal(true)}>{<MdLogout />}</p>
            </div>
            {isModal ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                    <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-lg mx-4 relative slide-in">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModal(false)}
                        >
                            &times;
                        </button>

                        <h2 className="text-2xl font-semibold text-zinc-200 mb-4 ">Do you want to logout</h2>
                        <div className="flex gap-5 float-right">
                            <button className="text-black w-16 h-7 rounded-md bg-gray-300" onClick={() => setIsModal(false)}>cancel</button>
                            <button className="text-white w-16 h-7 rounded-md bg-red-600" onClick={handleLogout}>Logout</button>
                        </div>


                    </div>

                </div>
            ) : (
                ''
            )}

        </div>


    )
}