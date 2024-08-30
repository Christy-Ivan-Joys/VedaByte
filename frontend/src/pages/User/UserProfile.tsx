import { useEffect, useState } from 'react'
import Header from '../../components/User/Header'
import { Panel } from '../../components/User/Panel'
import '../../styles/userProfile.css'
import { FaLock, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Student } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useChangeProfileimageMutation, useEditProfileMutation, useSendOtpMutation } from '../../utils/redux/slices/userApiSlices'
import { toast } from 'react-toastify'
import { setUser } from '../../utils/redux/slices/userAuthSlice'
import { useErrorHandler } from './ErrorBoundary'
import { validate } from '../../Helpers/validate'

export const UserProfile = () => {
    const { studentInfo } = useSelector((state: any) => state.userAuth)

    const [userDetails, setUserDetails] = useState<Student>()
    const [isModalOpen, setModalOpen] = useState(false)
    const [sendOtp] = useSendOtpMutation()
    const navigate = useNavigate()
    const [dropdown, setDropDown] = useState(false)
    const [changeProfileImage] = useChangeProfileimageMutation()
    const dispatch = useDispatch()
    const [isEdit, setisEdit] = useState(false)
    const [name, setName] = useState(studentInfo.name)
    const [email, setEmail] = useState(studentInfo.email)
    const [contact, setContact] = useState(studentInfo.contact)
    const [editProfile] = useEditProfileMutation()
    const handleError = useErrorHandler()

    const confirmChangePassword = async () => {
        const email = userDetails?.email
        const otp = await sendOtp({ email }).unwrap()
        if (otp) {
            localStorage.setItem('secret', otp)
            localStorage.setItem('action', 'changePassword')
        }
        navigate('/otp')
    }
    const handleUploadClick = () => {
        setDropDown(false)
        document.getElementById('fileInput')?.click()
    }

    const handleFileChange = async (e: any) => {
        const selectedFile = e.target.files[0]
        var validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

        try {
            const type = selectedFile.type
            if (type) {
                if (!validImageTypes.includes(type)) {
                    toast.error('upload a valid image')
                    return
                }
                const imageData = new FormData()
                imageData.append('file', selectedFile)
                imageData.append('upload_preset', 'vedaByte')

                const uploadImage = await fetch(`https://api.cloudinary.com/v1_1/dzhdkfjsw/image/upload`, {
                    method: 'POST',
                    body: imageData

                })
                const res = await uploadImage.json()
                const imageUrl = res.url
                const userId = studentInfo._id
                const user = await changeProfileImage({ imageUrl, userId }).unwrap()
                dispatch(setUser({ ...user }))
            }
        } catch (error: any) {

            if (error) {
                handleError(error)
            }

        }
    }

    const handleEditProfile = async () => {
        const data = { name, email, contact }
        const errorMessage = validate(name, email, contact)
        if (errorMessage) {
            toast.error(errorMessage)
            return
        }

        try {

            const res = await editProfile({ data }).unwrap()
            dispatch(setUser({ ...res }))
            setisEdit(false)

        } catch (error: any) {
            console.log(error)
            if (error.data.message === 'Access token is required' || error.data.message === 'User not found' || error.data.message === 'Invalid token'|| error.data.message === 'User is blocked') {
                handleError(error.data.message)
            } else {

            }
        }
    }

    useEffect(() => {

        if (studentInfo) {
            setUserDetails(studentInfo)
        }


    }, [studentInfo, userDetails])

    return (
        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg border-2 border-lime ">
                <Panel />

                <div className='main'>

                    <div className=''>
                        <div className="min-h-screen/2 flex items-center justify-center">
                            {
                                <div className="py-8 px-6 mt-5 shadow-lg rounded-lg w-full max-w-2xl flex flex-col justify-center border-2 ">


                                    <div className="flex justify-center mb-6 h-42 relative">
                                        {userDetails?.profileImage ? (
                                            <img src={userDetails?.profileImage} className="w-32 h-32 rounded-full mx-auto object-cover " style={{ width: '150px', height: '150px' }} />
                                        ) : (
                                            <p className="flex justify-center items-center bg-zinc-800 w-32 h-32 text-white text-md rounded-full"><FaUser size={40} /></p>
                                        )}
                                        <div
                                            className="absolute bottom-4 ml-8 transform translate-x-1/2 translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md cursor-pointer"
                                            onClick={() => setDropDown(!dropdown)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {dropdown && (
                                            <div className="absolute bg-black text-white shadow-md rounded  mt-32 z-50">
                                                <ul className="py-2">
                                                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleUploadClick}>
                                                        upload new image
                                                    </li>

                                                </ul>
                                            </div>
                                        )}
                                        <input type="file"
                                            id='fileInput'
                                            name='file'
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="mb-6 p-2 text-center">
                                        <h1 className="text-2xl font-bold">Profile Details</h1>
                                    </div>

                                    <div className='flex flex-col gap-3'>
                                        {isEdit ? (
                                            <div className='flex flex-col gap-5 justify-center items-center font-semibold'>
                                                <input className="border-b-2 rounded-lg w-1/2 p-2 text-black focus:outline-none" type="name" onChange={(e) => setName(e.target.value)} placeholder="Password" id="newPassword" value={name} />
                                                <input className="border-b-2  w-1/2  p-2 text-black focus:outline-none" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Password" id="newPassword" value={email} />
                                                <input className="border-b-2 rounded-lg w-1/2 p-2 text-black focus:outline-none" type="contact" onChange={(e) => setContact(e.target.value)} placeholder="Password" id="newPassword" value={contact} />
                                            </div>

                                        ) : (
                                            <div>
                                                <div className="flex flex-col justify-center items-center">
                                                    <h1 className="text-lg font-semibold">Name</h1>
                                                    <p>{userDetails?.name}</p>
                                                </div>
                                                <div className="flex flex-col justify-center items-center">
                                                    <h1 className="text-lg font-semibold">Email</h1>
                                                    <p>{userDetails?.email}</p>
                                                </div>
                                                <div className="flex flex-col justify-center items-center">
                                                    <h1 className="text-lg font-semibold">Contact</h1>
                                                    <p>{userDetails?.contact}</p>
                                                </div>
                                            </div>

                                        )}
                                        <div className="flex justify-between items-center p-5">
                                            <button onClick={() => setModalOpen(true)} className="text-lg text-blue-700 font-semibold underline flex gap-2 items-center pl-5">
                                                <FaLock /> Change password
                                            </button>
                                            {isEdit ? (
                                                <button className="bg-black text-white w-32 h-10 rounded-lg font-semibold hover:bg-white  hover:border-2 hover:text-black " onClick={handleEditProfile}>save changes</button>

                                            ) : (
                                                <button className="bg-black text-white w-24 h-10 rounded-lg font-semibold hover:bg-white hover:border-2 border-sky-400 hover:text-black" onClick={() => setisEdit(!isEdit)}>Edit</button>

                                            )
                                            }
                                        </div>

                                    </div>
                                </div>
                            }
                        </div>
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
                                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm slide-in">
                                    <h2 className="text-xl font-bold mb-4">Confirm Password Change</h2>
                                    <p className="mb-4">Are you sure you want to change your password?</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmChangePassword}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>


        </>
    )
}

{/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pl-16">
<div className="flex flex-col">
    <h1 className="text-lg font-semibold">Name</h1>
    <p>{userDetails?.name}</p>
</div>
<div className="flex flex-col">
    <h1 className="text-lg font-semibold">Email</h1>
    <p>{userDetails?.email}</p>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 pl-16">
<div className="flex flex-col">
    <h1 className="text-lg font-semibold">Contact</h1>
    <p>{userDetails?.contact}</p>
</div>
<div className="flex flex-col">
    <h1 className="text-lg font-semibold">Address</h1>
    <p>123 Main Street</p>
</div>
</div>

<div className="flex justify-between items-center">
<button onClick={() => setModalOpen(true)} className="text-lg text-blue-700 font-semibold underline flex gap-2 items-center pl-5">
    <FaLock /> Change password
</button>
<button className="bg-black text-white w-24 h-10 rounded-lg font-semibold hover:bg-white hover:text-black ">Edit</button>
</div> */}