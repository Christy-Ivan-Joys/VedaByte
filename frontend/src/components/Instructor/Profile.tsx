import { CircularProgress} from '@mui/material'
import { Sidebar } from "./Sidebar"
import { useNavigate } from "react-router-dom"
import { FaLock, FaUser } from "react-icons/fa"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import upload from "../../Helpers/Cloudinary"
import { useAddCertificationMutation, useAddQualificationMutation, useSendOTPMutation, useUpdateProfileDetailsMutation, useUpdateProfileImageMutation } from '../../utils/redux/slices/instructorApiSlices'
import { Header } from './Header'
import { setInstructor } from '../../utils/redux/slices/instructorAuthSlice'
import { useErrorHandler } from '../../pages/Instructor/ErrorBoundary'
import { validate } from '../../Helpers/validate'
import { QualificationModal } from '../../pages/Instructor/QualificationModal'
import { CertificationModal } from '../../pages/Instructor/CertificationModal'


export function Profile() {
    const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
    console.log(instructor, 'details in profile')


    const [name, setName] = useState(instructor.name)
    const [email, setEmail] = useState(instructor.email)
    const [contact, setContact] = useState(instructor.contact)
    const [profession,setProfession] = useState(instructor.profession)
    const [isModalOpen, setModalOpen] = useState(false)
    const [dropdown, setDropDown] = useState(false)
    const [isEdit, setisEdit] = useState(false)
    const [loading, isLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleError = useErrorHandler()
    const [updateProfileImage] = useUpdateProfileImageMutation()
    const [updateProfileDetails] = useUpdateProfileDetailsMutation()
    const [sendOTP] = useSendOTPMutation()
    const [qualificationModal, setQModalOpen] = useState(false)
    const [CModal, setCModalOpen] = useState(false)
    const [addQualification] = useAddQualificationMutation()
    const [addCertification] = useAddCertificationMutation()

    const confirmChangePassword = async () => {

        try {
            localStorage.setItem('action', 'changePassword')
            const otp = await sendOTP(undefined).unwrap()
            localStorage.setItem('secret', otp)
            navigate('/instructor/otp')
        } catch (error: any) {
            alert('errnr in catch')
            console.log(error, 'error in catch')
            handleError(error)
            console.log(error)
        }


    }

    const handleFileChange = async (e: any) => {
        isLoading(true)
        const image = e.target.files[0]
        var validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        const type = image.type
        if (!validImageTypes.includes(type)) {
            toast.error('Select a valid image')
            return
        }
        try {
            const Data = new FormData()
            Data.append('file', image)
            Data.append('upload_preset', 'vedaByte')
            const result = await upload('POST', Data)

            const res = await result.json()
            if (res.url) {
                const imageURL = res.url
                isLoading(false)
                const update = await updateProfileImage({ imageURL })
                console.log(update, 'error')
                dispatch(setInstructor({ ...update.data }))

            }

        } catch (error: any) {
            handleError(error.data.message)
            console.log(error)
            toast.error(error.message)
        }

    }
    const handleEditProfile = async () => {

        const hasError = validate(name, email, contact)
        if (hasError) {
            toast.error(hasError)
            return
        }
        setisEdit(false)
     try {
        const data = { name, email, contact ,profession}
        const update = await updateProfileDetails({ data })
        dispatch(setInstructor({ ...update.data }))

     } catch (error:any) {
        console.log(error)
          handleError(error.data.message)
     }
    }
    
    const handleUploadClick = () => {
        setDropDown(false)
        document.getElementById('fileInput')?.click()
    }
    const AddNewQualification = async (degree: string, institution: string) => {
        const certificationPattern = /^(?!.*([a-zA-Z])\1{2})[a-zA-Z][a-zA-Z\s-]*[a-zA-Z]$/
        if (!certificationPattern.test(degree.trim()) || !certificationPattern.test(institution.trim()) ) {
            toast.error('Enter a valid qualification details');
            return;
        }
        try {
            const qualification = { degree, institution }
            const data = await addQualification(qualification).unwrap()
            setQModalOpen(false)
            dispatch(setInstructor({ ...data }))
        } catch (error: any) {
            console.log(error)
            handleError(error.data.message)
        }
    }
    const AddNewCertification = async (certification: string) => {
        const certificationPattern = /^(?!.*([a-zA-Z])\1{2})[a-zA-Z][a-zA-Z\s-]*[a-zA-Z]$/
        if (!certificationPattern.test(certification.trim())) {
            toast.error('Enter a valid certification');
            return;
        }
        setCModalOpen(false)
        try {
            const update = await addCertification({ certification }).unwrap()
            setCModalOpen(false)
            dispatch(setInstructor({ ...update }))
        } catch (error: any) {

            console.log(error)
            handleError(error.data.message)
            
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="min-h-screen/2 flex items-start justify-start p-5 border-2">
                    <div className="py-8 px-5 mt-5 shadow-lg rounded-lg w-full flex flex-col lg:flex-row justify-start  bg-white ">
                        <div className="items-center lg:items-start  lg:mb-0 lg:w-50 relative ">
                            {instructor?.profileImage ? (
                                <img src={instructor?.profileImage} className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover" />
                            ) : (
                                <p className="flex justify-center items-center bg-zinc-800 text-white w-32 h-32 lg:w-40 lg:h-40 text-md rounded-full"><FaUser size={40} /></p>
                            )}
                            {loading && (
                                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 rounded-full">
                                    <CircularProgress />
                                </div>
                            )}
                            <div
                                className="absolute  ml-28 top-28 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md cursor-pointer"
                                onClick={() => setDropDown(!dropdown)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {dropdown && (
                                <div className="absolute bg-black text-white shadow-md rounded z-50">
                                    <ul className="py-2">
                                        <li className="px-2 py-1 hover:bg-gray-700 cursor-pointer" onClick={handleUploadClick}>
                                            Upload new image
                                        </li>
                                    </ul>
                                </div>
                            )}
                            <input type="file" id='fileInput' name='file' hidden onChange={handleFileChange} />
                        </div>
                        <div className="flex flex-col justify-start items-start lg:ml-10 lg:w-2/3">
                            <div className="mb-6 p-2 text-center lg:text-left">
                                <h1 className="text-2xl font-bold">{instructor?.name}</h1>
                                <h1 className="text-lg text-zinc-600 font-bold">{instructor?.profession}</h1>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex flex-col lg:flex-row justify-center lg:justify-start items-center gap-5 lg:gap-10'>
                                    {isEdit ? (
                                        <div className='flex flex-col lg:flex-row gap-5 font-semibold'>
                                            <input
                                                className="border-b-2 rounded-lg p-2 text-black focus:outline-none"
                                                type="text"
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Name"
                                                value={name}
                                            />
                                            <input
                                                className="border-b-2 rounded-lg p-2 text-black focus:outline-none"
                                                type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email"
                                                value={email}
                                            />
                                            <input
                                                className="border-b-2 rounded-lg p-2 text-black focus:outline-none"
                                                type="text"
                                                onChange={(e) => setContact(e.target.value)}
                                                placeholder="Contact"
                                                value={contact}
                                            />
                                            <input
                                                className="border-b-2 rounded-lg p-2 text-black focus:outline-none"
                                                type="text"
                                                onChange={(e) => setProfession(e.target.value)}
                                                placeholder="profession"
                                                value={profession}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col lg:flex-row gap-10">
                                            <div className="flex flex-col justify-center gap-2 items-start">
                                                <h1 className="text-sm font-semibold text-zinc-600">Name</h1>
                                                <p className='font-semibold'>{instructor?.name}</p>
                                            </div>
                                            <div className="flex flex-col justify-center gap-2 items-start">
                                                <h1 className="text-sm font-semibold text-zinc-600">Email</h1>
                                                <p className='font-semibold'>{instructor?.email}</p>
                                            </div>
                                            <div className="flex flex-col justify-start gap-2 items-start">
                                                <h1 className="text-sm font-semibold text-zinc-600">Contact</h1>
                                                <p className='font-semibold'>{instructor?.contact}</p>
                                            </div>
                                            <div className="flex flex-col justify-center gap-2 items-center">
                                                <h1 className="text-sm font-semibold text-zinc-600">Profession</h1>
                                                {instructor?.profession !== null ? (
                                                    <p className='font-semibold'>{instructor?.profession}</p>

                                                ) : (
                                                    <p className='font-semibold'>nil</p>

                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='mt-5 w-full'>
                                <h1 className='font-semibold text-lg py-3  text-zinc-800'>Qualifications</h1>
                                {instructor?.qualifications?.length ? (
                                    instructor?.qualifications?.map((qualification: any) => (

                                        <div className='flex flex-col gap-2 border-2 px-2 py-2'>
                                            <p className='text-md text-green-800 font-semibold'>{qualification?.degree}</p>
                                            <p className='text-sm text-green-800 font-normal'>{qualification?.institution}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-rose-500'>No qualifications added</p>
                                )}

                                <button className='underline text-blue-800 mt-5 float-right' onClick={() => setQModalOpen(true)}>Add qualification</button>
                            </div>
                            <div className='w-full'>
                                <h1 className='font-semibold text-lg  text-zinc-800'>Certifications</h1>
                                {instructor?.certifications?.length ? (
                                    instructor?.certifications?.map((certification: any) => (

                                        <div className='flex flex-col gap-2 border-2 px-2 py-2'>
                                            <p className='text-md text-green-800 font-semibold'>{certification?.certification}</p>
                                        </div>

                                    ))
                                ) : (
                                    <p className='text-rose-500 text-sm'>No certifications added</p>
                                )}
                                <button className='underline text-blue-800 mt-5 float-end' onClick={() => setCModalOpen(true)}>Add certification</button>
                            </div>
                            <div className="flex justify-between items-center py-5  w-full">
                                <button onClick={() => setModalOpen(true)} className="text-lg float-left text-blue-700 font-semibold underline flex gap-2 items-center">
                                    <FaLock /> Change password
                                </button>
                                {isEdit ? (
                                    <button className="bg-black text-white w-32 h-10 rounded-lg font-semibold hover:bg-white hover:border-2 hover:text-black" onClick={handleEditProfile}>Save changes</button>
                                ) : (
                                    <button className="bg-white text-black border-2 border-black w-24 h-8 rounded-lg font-semibold hover:bg-white hover:border-2 float-right hover:text-black" onClick={() => setisEdit(!isEdit)}>Edit</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {qualificationModal && <QualificationModal setQModalOpen={setQModalOpen} AddNewQualification={AddNewQualification} />}
                {CModal && <CertificationModal setCModalOpen={setCModalOpen} AddNewCertification={AddNewCertification} />}
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
    )
}