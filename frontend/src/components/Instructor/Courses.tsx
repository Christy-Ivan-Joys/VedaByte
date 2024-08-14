
import { Sidebar } from "./Sidebar"
import { Link } from "react-router-dom"
import {  FaSearch, FaPlus } from "react-icons/fa"
import { CourseCard } from "./CourseCard"
import { useEffect, useState } from "react"
import { useCoursesMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useErrorHandler } from "../../pages/Instructor/ErrorBoundary"
import { Header } from "./Header"
import { Paginate } from "../../Helpers/Pagination"
    import Pagination from '@mui/material/Pagination';
    import Stack from '@mui/material/Stack';

export function Courses() {
    const [courses] = useCoursesMutation()
    const [instructorId, setInstructorId] = useState('')
    const [data, setData] = useState([])
    const handleError = useErrorHandler()
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const coursePerPage = 3

    useEffect(() => {
        async function fetchCourseDetails() {
            try {
                const instructorData = localStorage.getItem('instructorInfo')
                if (instructorData) {
                    const details = JSON.parse(instructorData)
                    if (details && details._id) {
                        setInstructorId(details._id)

                    }
                }
                if (instructorId) {
                    const data = await courses(undefined).unwrap()
                    if (data.length) {
                        const { totalPages, paginatedItems } = Paginate(data, currentPage, coursePerPage)
                        setData(paginatedItems)
                        setPages(totalPages)
                    }
                }

            } catch (error: any) {

                console.log(error)
                handleError(error?.data?.message)
            }
        }

        fetchCourseDetails()
    }, [instructorId, currentPage])

    const handleFilter = (letter: string) => {
        console.log(letter)
    }
    


    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="overflow-x-auto p-8 mt-2 bg-white shadow-xl rounded-lg  ">

                    <div className="px-8 p-2 flex justify-between items-center">
                        <div className="flex gap-5">

                            <Link to='/instructor/addcourse' className="flex">
                                <button className="bg-black rounded-lg text-white w-36 h-9 flex justify-center gap-2 font-light items-center ">
                                    Add course <FaPlus /></button>
                            </Link>
                        </div>
                        <div className="relative w-72">
                            <input
                                type="text"
                                className="w-full h-10 pl-10 pr-4 rounded-3xl shadow focus:outline-none"
                                placeholder="Search"
                                onChange={(e) => handleFilter(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                <FaSearch />
                            </div>
                        </div>
                    </div>

                    <div className="w-screen/2 border-t border-gray-500"></div>
                    <CourseCard courses={data} />
                    <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-4 items-center">
                        <Pagination
                            color="standard"
                            count={pages}
                            shape="rounded"
                            page={currentPage}
                            onChange={(_,value)=>setCurrentPage(value)}
                        />
                    </Stack>
                </div>
            </div>
        </div>
    )
}