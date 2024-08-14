import { FaEnvelope, FaPhone,FaUser } from "react-icons/fa"
import Header from "./Header"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFetchInstructorCoursesMutation, useInstructorsMutation } from "../../utils/redux/slices/userApiSlices"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Paginate } from "../../Helpers/Pagination"
import Footer from "./Footer"

export const TutorDetails = () => {

    const { id } = useParams()
    const [Instructors] = useInstructorsMutation()
    const [Instructor, setInstructor] = useState<any>({})
    const [fetchInstructorCourses] = useFetchInstructorCoursesMutation()
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const coursePerPage = 4

    useEffect(() => {
        const fetchData = async () => {
            const result = await Instructors(undefined).unwrap()
            result.map((tutor: any) => {
                if (tutor._id === id) {
                    setInstructor(tutor)
                }
            })

            const courses = await fetchInstructorCourses(id).unwrap()
            const {paginatedItems,totalPages} = Paginate(courses,currentPage,coursePerPage)
            setCourses(paginatedItems)
            setPages(totalPages)

        }

        fetchData()
    }, [currentPage])
    const handleClick = (id: string) => {
        alert(id)
        navigate(`/courseDetails/${id}`)
    }

    return (
        <div className="overflow-hidden">
            <Header />
            <div className="px-4 sm:px-6 lg:px-32 h-full mt-5 py-5 ">
                <div className="h-full px-4 sm:px-6 lg:px-16 py-10 border-2 rounded-lg border-sky-100 shadow-xl">
                    <div className="flex flex-col sm:flex-row ">
                        <div className="flex flex-col sm:flex-row w-full bg-zinc-900 rounded-lg p-4">
                        {Instructor?.profileImage ? (
                            <img src={Instructor?.profileImage} className="rounded-full w-32 h-32 mx-auto sm:mx-0 object-cover" />

                            ):(
                                <p className="flex justify-center items-center text-white bg-zinc-700 w-32 h-32 text-md rounded-full  object-cover"><FaUser size={30} /></p>

                            )}
                            <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col justify-center items-center sm:items-start p-8">
                                <h1 className="text-zinc-300 font-semibold text-2xl text-center sm:text-left">{Instructor?.name}</h1>
                                <p className="font-semibold text-emerald-400 text-center sm:text-left">{Instructor?.profession}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 sm:mt-8 ">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center sm:justify-start items-center">
                            <p className="flex gap-2 justify-center items-center text-sm font-semibold text-zinc-700">
                                <FaEnvelope size={20} className="text-blue-700" />
                                {Instructor?.email}
                            </p>
                            <p className="flex gap-2 justify-center items-center text-sm font-semibold text-zinc-700">
                                <FaPhone />
                                {Instructor?.contact}
                            </p>
                        </div>
                    </div>
                    <div className="pt-4">
                        <h1 className="text-lg font-semibold text-zinc-800 py-2">Qualifications</h1>
                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1">
                            {Instructor?.qualifications?.length ? (
                                Instructor?.qualifications?.map((qualification: any) => (
                                    <div className="flex flex-col bg-buttonGreen max-w-full lg:max-w-md border-2 px-2">
                                        <p className="text-md text-white font-semibold">{qualification?.degree}</p>
                                        <p className="text-md text-white font-normal">Mar Gregorios</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-rose-500 text-sm'>No qualifications to show</p>

                            )}
                        </div>
                    </div>
                    <div className="pt-4">
                        <h1 className="text-lg font-semibold text-zinc-800 py-2">Certifications</h1>
                        {Instructor?.certifications?.length ? (
                            Instructor?.certifications?.map((certification: any) => (
                                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1">
                                    <div className="flex flex-col bg-buttonGreen max-w-full lg:max-w-md border-2 px-2">
                                        <p className="text-md text-white font-semibold">{certification?.certification}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-rose-500 text-sm'>No certifications to show</p>

                        )}
                    </div>
                    <div className="mt-10">
                        <h1 className="font-bold text-emerald-800 text-2xl text-center">Courses by {`${Instructor?.name}`}</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {courses.length ? (
                                courses.map((course: any) => (
                                    <div className="bg-zinc-900 shadow-md rounded-lg p-4 hover:shadow-lg 
                                    transform transition-transform duration-700 ease-in-out hover:scale-105" onClick={() => handleClick(course?._id)}>
                                        <img src={course?.courseImage} alt={course.name} className="w-full h-40 object-cover rounded-t-lg"/>
                                        <div className="mt-2">
                                            <h2 className="text-lg font-semibold text-zinc-300">{course.name}</h2>
                                        </div>
                                        <div className="flex justify-between mt-5">
                                            <p className="text-md  mt-1 text-zinc-300">₹ {course.price}</p>
                                            <button className="flex justify-center items-center bg-buttonGreen text-white w-20 h-6 rounded-lg">details</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-rose-500 text-sm">No courses to show</p>
                            )}
                        </div>

                        <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-10  mt-10 items-center">
                            <Pagination

                                color="standard"
                                count={pages}
                                shape="rounded"
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                            />
                        </Stack>
                    </div>
                </div>
            </div>

<Footer/>
        </div>
    )
}