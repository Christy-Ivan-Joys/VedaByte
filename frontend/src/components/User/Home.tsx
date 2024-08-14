import '../../styles/sample.css'
import '../../styles/Home.css'
import logo from '../../../public/images/5582931.png'
import { useEffect, useState } from 'react'
import { FaShoppingBag, FaSearch, FaUser, FaBars } from 'react-icons/fa'
import { Courses } from './Courses'
import { StudentLogout, reveal } from '../../Helpers/Home'
import { CourseCard } from './CourseCard'
import { useFetchCoursesMutation } from '../../utils/redux/slices/userApiSlices'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../utils/redux/slices/userAuthSlice'
import Footer from './Footer'
import Home1 from './Home1'


export function Home() {
    const [userExist, setUserExist] = useState(false)
    const [searchVisible, setSearchVisible] = useState(false)
    const [fetchCourses] = useFetchCoursesMutation()
    const [courses, setCourses] = useState([])
    const dispatch = useDispatch()
    const { studentInfo } = useSelector((state: any) => state.userAuth)
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (studentInfo.name) {
            setUserExist(true)
        }
        window.addEventListener('scroll', reveal);
        const getCourses = async () => {
            const courses = await fetchCourses(undefined).unwrap()
            console.log(courses)
            if (courses) {
                setCourses(courses.slice(0, 4))
            }
        }
        reveal()
        getCourses()

    }, [setCourses, reveal, studentInfo])

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        dispatch(setUser(null))
        StudentLogout(dispatch)
        setUserExist(false)
        navigate('/login')
    }
    return (
        <div className='overflow-hidden'>
            <div className="w-screen  h-screen bg-gradient-to-r from-startgreen via-middlegreen to-endgreen  overflow-hidden">
                <div className="flex justify-between items-center p-5 h-24 relative px-32">
                    <div className="flex items-center gap-16 h-20 ">
                        <h1 className='font-bold text-white text-xl'>Veda<span className='text-black font-bold text-2xl'>B</span>yte <span className='text-buttonGreen text-3xl'>.</span></h1>
                        <ul className="hidden md:flex gap-16 nav-elems hover:cursor-pointer">
                            <li><button className="text-white border-2 border-buttonGreen w-24 h-8 rounded hover:bg-white hover:text-endgreen"><Link to='/courses'>Courses</Link></button></li>
                            <li className="text-white"><Link to='/'>Home</Link></li>
                            <li className="text-white"><Link to='/tutors'>Tutors</Link></li>
                            <li className="text-white">Blog</li>
                        </ul>
                    </div>
                    <button className="text-white md:hidden" onClick={handleSidebarToggle}>
                            <FaBars size={24} />
                        </button>
                    <div className="hidden md:flex items-center gap-4">
                        
                        {userExist && (
                            <div className="flex items-center text-white nav-elems gap-8">
                                <div className='hover:cursor-pointer' onClick={() => setSearchVisible(!searchVisible)}>
                                    <FaSearch size={19} />
                                </div>
                                {searchVisible && (
                                    <input
                                        type="text"
                                        className="ml-2 p-1 focus:outline-none focus:border-transparent rounded-full text-black"
                                        placeholder="Search..."
                                        autoFocus
                                    />
                                )}
                                <Link to='/cart'><FaShoppingBag size={20} /></Link>
                                <div className="relative flex justify-center items-center">
                                    <div className="relative group">
                                        <div className="flex text-endgreen bg-white rounded-full w-10 h-10 justify-center items-center cursor-pointer">
                                            <FaUser />
                                        </div>
                                        <div className="absolute hidden group-hover:block hover:block bg-white text-black shadow-md rounded right-0">
                                            <ul className="py-2">
                                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"><Link to='/profile'>Profile</Link></li>
                                                <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleLogout}>Logout</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`fixed top-0 left-0 w-64 h-full bg-white border-r-2 border-lime-400 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                        <div className="flex justify-end p-4">
                            <button onClick={handleSidebarToggle}>
                                <FaBars size={24} />
                            </button>
                        </div>
                        <ul className="flex flex-col p-4 space-y-4">
                            <li><Link to='/courses' onClick={handleSidebarToggle}>Courses</Link></li>
                            <li><Link to='/' onClick={handleSidebarToggle}>Home</Link></li>
                            <li><Link to='/tutors' onClick={handleSidebarToggle}>Tutors</Link></li>
                            <li>Blog</li>
                            {!userExist && (
                                <li><Link to='/login' onClick={handleSidebarToggle}>Log In</Link></li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between  mt-20 px-40 p-16 slide-in ">
                    <div className="text-center sm:text-left flex-1 justify-center items-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-white">
                            <span className="block">Enroll & <span className='text-buttonGreen'>grow up </span></span>
                            <span className="block mt-5"> your skills today !
                                <span className='text-buttonGreen font-extrabold text-8xl '>.</span>
                            </span>
                        </h1>
                        <br />
                        <p className="mt-4 text-base sm:text-base text-white">
                            VedaByte provides you with a complete eLearning platform so that you get to offer great classes to students worldwide.
                        </p>
                        <div className="mt-6">
                            <button className=" bg-buttonGreen text-white from-neutral-200 px-7 py-2.5 rounded-sm mr-4 "><Link to='/courses'>Browse All Courses</Link></button>
                            <button className=" text-white border-buttonGreen font-sans  text-xs font-bold border-2 px-16 py-3 rounded-sm ml-5 hover:bg-white hover:text-endgreen">GET STARTED</button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center ml-16 sm:mt-0 relative">
                        <div className="sm:border-2 border-buttonGreen w-72 h-72 absolute" style={{ top: '-240px', left: '150px', zIndex: 10 }}></div>
                        <div className="sm:border-2 border-buttonGreen w-72 h-72 absolute" style={{ top: '-120px', left: '10px', zIndex: 20 }}></div>
                    </div>
                </div>
            </div>
            <div className='bg-white h-screen w-screen overflow-auto px-10' >
                <div className='items-center text-center p-16  '>
                    <h1 className='text-3xl font- font-bold slide-in text-zinc-800 '> Our Top Courses</h1>
                    <p className=' text-center text-sm p-3 font-semibold'>We make learning covinient affordable and fun !</p>

                </div>
                <div className="flex px-32  h-auto justify-center items-center gap-8 slide-in">
                    <CourseCard courses={courses} />
                </div>
            </div>
            <Courses />
            <Home1 />
            <div>
                <Footer />
            </div>
        </div>
    )
}