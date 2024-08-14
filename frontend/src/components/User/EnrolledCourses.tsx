import Header from "./Header"
import { Panel } from "./Panel"
import { FaSearch } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useFetchEnrolledCoursesMutation } from "../../utils/redux/slices/userApiSlices"
import { useErrorHandler } from "../../pages/User/ErrorBoundary"
import { EnrolledCoursesCard } from "./EnrolledCoursesCard"
import { Paginate } from "../../Helpers/Pagination"
import { Pagination, Stack } from "@mui/material"

export const EnrolledCourses = () => {
    const [certified, setCertified] = useState(false)
    const [certifiedData, setCertifiedData] = useState([])
    const [fetchEnrolledCourses] = useFetchEnrolledCoursesMutation()
    const [data, setData] = useState([])
    const handleError = useErrorHandler()
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState(0)
    const coursePerPage = 4
     
    useEffect(() => {

        const fetchData = async () => {
            try {
                const Enrollments = await fetchEnrolledCourses(undefined).unwrap()
                let EnrolledCourses: any = []
                let certifiedEnrollments: any = []
                Enrollments.map((course: any) => {

                    if (course.completed === true) {
                        certifiedEnrollments.push(course)
                    }
                    if (course.completed === false) {
                        EnrolledCourses.push(course)
                    }
                    return certifiedEnrollments
                })
                
                const {totalPages,paginatedItems} = Paginate(EnrolledCourses,currentPage, coursePerPage)
                
                setCertifiedData(certifiedEnrollments)
                setData(paginatedItems)
                setPages(totalPages)
             
            } catch (error: any) {
                console.log(error, 'erorr in fetch courses in enrolled in profile')
                if (error.data?.message === 'Access token is required' ||
                    error.data?.message === 'User not found' ||
                    error.data?.message === 'Invalid token') {
                    handleError(error.data.message)
                } else {
                    console.log('other error')
                }
            }
        }
        fetchData()
        return () => {
            setData([])
            setCertifiedData([])
        }

    }, [handleError,currentPage])

    const handleFilter = (letter: string) => {
       console.log(letter)
    }
    
    return (

        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg ">
                <Panel />

                <div className='main mt-5'>
                    <div className="overflow-x-auto p-10 mt-2 bg-white shadow-xl rounded-lg border-2 border-sky-100 ">

                        <div className="px-8 p-5 flex justify-between items-center">
                            <div className="flex gap-5 ">

                                <button className={` text-md font-semibold w-32 rounded-md h-8 ${location.pathname === '/enrolledCourses' && certified === false ? 'bg-white text-black border-2 border-buttonGreen' : 'bg-black text-white'}`} onClick={() => setCertified(false)}>
                                    Enrolled<span className="bg-black  text-sm text-white ml-2 px-2 rounded-md ">{data.length}</span></button>
                                <button className={` text-md font-semibold w-32 rounded-md h-8 ${certified ? 'bg-white text-black border-2 border-buttonGreen' : 'bg-black text-white'}`} onClick={() => setCertified(true)}>
                                    Certified<span className="bg-white  text-sm text-black ml-2 px-2 rounded-md ">{certifiedData.length}</span></button>
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
                        <EnrolledCoursesCard Enrollments={certified ? certifiedData : data} />
                        <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-4 items-center">
                            <Pagination
                                color="standard"
                                count={pages}
                                shape="rounded"
                                page={currentPage}
                                onChange={(_,value) => setCurrentPage(value)}
                            />
                        </Stack>
                    </div>
                   
                </div>
            </div>
        </>
    )
}
