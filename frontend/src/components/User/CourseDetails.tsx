import { FaYoutube, FaPlus } from "react-icons/fa"
import Header from "./Header"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAddToCartMutation, useFetchCoursesMutation } from "../../utils/redux/slices/userApiSlices"
import { Course } from "../../types"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../utils/redux/slices/userAuthSlice"
import { Link } from "react-router-dom"
import VideoModal from "../../pages/User/VideoModal"
import Footer from "./Footer"
import Review from "./Review"

export const CourseDetails = () => {
    const [isOpen, setIsOpen] = useState(false)
    const studentInfo = useSelector((state: any) => state.userAuth.studentInfo)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const { id } = useParams()
    const [fetchCourses] = useFetchCoursesMutation()
    const [details, setDetails] = useState<Course>()
    const [addToCart] = useAddToCartMutation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);


    const toggleDrawer = () => {
        setIsOpen(!isOpen)
    }

    const handleVideoClick = () => {
      setIsVideoModalOpen(true);
    };
  
    const closeVideoModal = () => {
      setIsVideoModalOpen(false);
    };

    useEffect(() => {
        const enrolled = studentInfo?.enrollments?.find((courseId: string) => {
            return courseId === id
        })
        if (enrolled) {
            setIsEnrolled(true)
        }

        const getCourses = async () => {
            const courses = await fetchCourses(undefined).unwrap()
            if (courses) {
                courses.map((course: Course) => {
                    if (course._id === id) {
                        setDetails(course)
                    }
                })
            }
        }
        getCourses()
        console.log(details)
    }, [setDetails, fetchCourses, id])

    const handleAddtoCart = async (id: string) => {
        const studentInfo = localStorage.getItem('studentInfo')
        const studentDetails = studentInfo ? JSON.parse(studentInfo) : null

        if (!studentDetails) {
            toast.error('Please login to purchase courses')
            navigate('/login')
            return
        }
        try {

            const studentId = studentDetails._id
            const res = await addToCart({ id, studentId }).unwrap()
            dispatch(setUser({ ...res }))
            if (res) {
                toast.success('Course added to cart')
                navigate('/cart')
            }
        } catch (error: any) {
            console.log(error)
            if (error.data.message === 'Course already added in cart') {
                toast.info('Course already added in cart')
                navigate('/cart')
            } else if (error.data.message === 'User not found') {
                toast.error('Authentication error')
            } else if (error.data.message === 'Course already enrolled') {
                toast.error('Cannot add to cart.Course already enrolled !')
            } else {
                toast.error('Internal server error')
            }
        }
    }

    return (
        <div className="overflow-hidden">
            <Header />
            {details && (
                <div className="px-48 p-5  ">
                    <div className="rounded-sm shadow-lg h-full px-8 py-5  bg-zinc-100 border-2 border-blue-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col py-5">
                                <div className="relative">

                                    <img src={details.courseImage}

                                        alt="Image"
                                        className=" h-72 object-cover rounded-lg shadow-lg shadow-buttonGreen "
                                        style={{ width: '450px' }}
                                    />

                                    <label htmlFor="" className="absolute top-0 left-0 bg-buttonGreen px-5 text-white font-semibold text-sm h-7 inline-flex items-center justify-center">{details.category}</label>
                                </div>

                            </div>

                            <div className="flex flex-col py-2 gap-2">
                                <h1 className="text-2xl font-bold text-zinc-700">{details.name}</h1>
                                <button className="flex  justify-center items-center  gap-3 bg-buttonGreen text-white rounded-md" onClick={handleVideoClick}>Watch Introduction <FaYoutube /></button>
                                <p className="text-sm font-medium text-zinc-500 p-0">{details.description}</p>
                                <p className="text-sm font-semibold text-zinc-600">Level : {details.courselevel}</p>
                                <p className="text-sm font-semibold text-zinc-600">{details.category}</p>
                                <p className=" flex text-sm font-medium text-zinc-600 justify-between">duration<span className="px-10 text-2xl"> <span className='text-gray-600 font-bold'>₹ </span>{details.price}</span> </p>
                                <p className="flex text-3xl font-medium text-pink-500 gap-2 justify-start items-center"><FaYoutube /> <span className="text-sm text-zinc-700 ">{details.module.length} sections</span> </p>
                            </div>
                        </div>
                        {isEnrolled ? (
                            <div className='flex justify-end items-start gap-5'>

                                <button className=" flex justify-center items-center gap-2 text-sm text-white font-normal p-1 bg-buttonGreen border-2 border-buttonGreen rounded-lg"><FaYoutube size={24} /><Link to={`/videos/${details._id}`}>Course</Link></button>

                            </div>

                        ) : (
                            <div className='flex justify-end items-start gap-5'>
                                <button className='bg-gradient-to-r from-startgreen via-middlegreen to-endgreen p-2 w-24 rounded-sm text-white hover:bg-white hover:text-black'>Enroll</button>
                                <button className='bg-gradient-to-r from-startgreen via-middlegreen to-endgreen p-2 w-24 rounded-sm text-white hover:bg-white hover:text-black' onClick={() => handleAddtoCart(details._id)}>Add to cart</button>

                            </div>
                        )}

                    </div>
                    <div className=" flex rounded-sm shadow-lg h-full border-2 border-blue-100 mt-5 justify-between items-center px-5">
                        <h1 className="p-5 font-semibold text-xl text-zinc-800">Course Sections</h1>
                        {isEnrolled ? (
                            <div className="flex gap-5">
                                <button className=" flex justify-center items-center gap-2 text-sm text-white font-normal p-1 bg-buttonGreen border-2 border-buttonGreen rounded-lg"><FaYoutube size={24} /><Link to={`/videos/${details._id}`}>Course</Link></button>
                                <p className=" flex bg-zinc-600 rounded-full w-8 h-8 text-white justify-center items-center" onClick={() => toggleDrawer()}><FaPlus /></p>
                            </div>
                        ) : (
                            <p className=" flex bg-zinc-600 rounded-full w-8 h-8 text-white justify-center items-center" onClick={() => toggleDrawer()}><FaPlus /></p>

                        )}


                    </div>
                    {
                        details.module.map((section, index) => (
                            isOpen && (

                                <div className="drawer slide-in  bg-white shadow-lg rounded-lg  p-5 border-2 border-blue-100">
                                    <h2 className="text-xl font-bold mb-4">{`Section ${index + 1}`}</h2>
                                    <p className="text-sky-900 font-semibold">{section.title}</p>
                                    <p className="text-sm font-semibold">{section.description}</p>
                                    <p className="flex text-3xl font-medium text-pink-500 gap-2 justify-start items-center"><FaYoutube /> <span className="text-sm text-zinc-700 "> Duration : 3.00.00 hrs</span> </p>
                                </div>
                            )
                        ))
                    }
                </div >
            )}
            <div className="h-auto  px-48 py-5 relative slide-in">
                <div className=" rounded-lg shadow-xl relative overflow-hidden z-10">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-4xl p-3 font-sans font text-zinc-600">Meet the Instructor</h1>
                        <h1 className="text-md font-semibold text-zinc-700">{details?.InstructorId?.name}</h1>
                        <h1 className="text-md font-semibold text-zinc-500 ">christyivanjoys@gmail.com</h1>
                    </div>
                    <div className="flex justify-between items-center px-20 py-5">
                        <div className="flex flex-col gap-2 ">
                            <h1 className="text-lg font-bold ">Total courses</h1>

                        </div>
                        <div className="flex justify-center items-center mr-16">
                            <img src={details?.InstructorId?.profileImage} className="bg-black w-32 h-32 rounded-full object-cover" alt="" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold ">Rating</h1>

                        </div>
                    </div>
                </div>
            </div>
            <VideoModal
                isOpen={isVideoModalOpen}
                 videoUrl={details?.Introvideo}
                onClose={closeVideoModal}
            />
           <Review course={details}/>
            <Footer/>
        </div >

    )
}