import { Sidebar } from "./Sidebar"
import { FaBook, FaDollarSign, FaUserGraduate } from "react-icons/fa"
import '../../styles/Dashboard.css'
import { useSelector } from "react-redux"
import { Header } from "./Header"
import { useEffect, useState } from "react"
import { useFetchDataForDashboardMutation, useFetchEnrolledStudentsMutation } from "../../utils/redux/slices/instructorApiSlices"
import InstructorChart from "./InstructorChart"
import { Link } from "react-router-dom"
import { useErrorHandler } from "../../pages/Instructor/ErrorBoundary"
// import CourseStatusChart from "./CourseStatusChart"
export function Dashboard() {
    const [fetchEnrolledStudents] = useFetchEnrolledStudentsMutation()
    const [fetchDataForDashboard] = useFetchDataForDashboardMutation()
    const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
    const [students, setStudents] = useState([])
    const [enrollments, setEnrollments] = useState([])
    // const [enrollmentDetails,setEnrollmentDetails] = useState([])
    const [total, setTotal] = useState<number>(0)
    const [courses, setCourses] = useState([])
    const handleError = useErrorHandler()
    useEffect(() => {
        const fetchData = async () => {
            try {

                const students = await fetchEnrolledStudents(instructor._id)
                console.log(students)
                setStudents(students?.data)
                const data = await fetchDataForDashboard(undefined).unwrap()
                console.log(data)
                setEnrollments(data.enrollments)
                setTotal(data.total)
                // setEnrollmentDetails(data.enrollmentDetails)
                setCourses(data.instructorCourses)
            } catch (error: any) {
                handleError(error.data.message)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="flex">
            <Sidebar />
            <div className="content">
                <Header /> 
                <div className="m-3 ">
                    <p className="font-bold text-xl p-5">Dashboard</p>
                    <div className="flex justify-start gap-10">
                        <Link to='/instructor/courses'>
                            <div className="flex flex-col items-center justify-center flex-grow-1 h-32 p-10 bg-zinc-800 rounded-lg shadow-lg">

                                <p className="text-white text-2xl"><FaBook /></p>
                                <h1 className="text-white text-md">Courses</h1>
                                <p className="text-white text-2xl">{courses.length}</p>
                            </div>
                        </Link>
                        <div className="flex flex-col items-center justify-center flex-grow-1 h-32 p-10 bg-zinc-800 rounded-lg shadow-lg">
                            <p className="text-white text-2xl"><FaDollarSign /></p>
                            <h1 className="text-white text-lg">Total Revenue</h1>
                            <p className="text-white text-2xl">{total}</p>
                        </div>
                        <Link to='/instructor/students'>
                            <div className="flex flex-col items-center justify-center flex-grow-1 h-32 p-10 bg-zinc-800 rounded-lg shadow-lg">
                                <p className="text-white text-2xl"><FaUserGraduate /></p>

                                <h1 className="text-white text-lg">Students</h1>
                                <p className="text-white text-2xl">{students?.length}</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="">
                    <InstructorChart courses={enrollments} />
                    {/* <CourseStatusChart enrollmentDetails={enrollmentDetails} /> */}
                </div>
            </div>
        </div>

    )
}