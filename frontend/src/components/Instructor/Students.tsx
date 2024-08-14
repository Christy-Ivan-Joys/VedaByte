import { Sidebar } from "./Sidebar"
import { useSelector } from "react-redux"
import { FaSearch, FaUser } from "react-icons/fa"
import { useFetchEnrolledStudentsMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useEffect, useState } from "react"
import { useErrorHandler } from "../../pages/Instructor/ErrorBoundary"
import { Header } from "./Header"


export function Students() {
    const [EnrolledStudents, setEnrolledStudents] = useState([])
    const instructor = useSelector((state: any) => state.instructorAuth.instructorInfo)
    const [studentsEnrolled] = useFetchEnrolledStudentsMutation()
    const [isLoading, setIsLoading] = useState(false)
    const errorHandler = useErrorHandler()

    const handleFilter = (e: any) => {

    }
    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true)
                const students = await studentsEnrolled(undefined).unwrap()
                setEnrolledStudents(students)
                setIsLoading(false)
                
            } catch (error: any) {

                console.log(error)
                errorHandler(error.data.message)
            }


        }
        fetchData()

    }, [])

    return (

        <div className="main-layout">
            <Sidebar />
            <div className="content">
            
                <Header/>
                <div className="overflow-x-auto p-5 mt-2 py-5 bg-white shadow-xl rounded-lg  ">


                    <div className="overflow-x-auto p-10 mt-2 bg-gray-300 shadow-xl rounded-lg  ">
                        <div className="flex justify-between p-5">
                            <div className="relative w-72">
                                <input
                                    type="text"
                                    className="w-full h-10 pl-10 pr-4 rounded-3xl shadow- focus:outline-none "
                                    placeholder="Search" onChange={(e) => handleFilter(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                    <FaSearch />
                                </div>
                            </div>
                        </div>
                        {EnrolledStudents.length ? (

                            <table className="table-auto min-w-full divide-y divide-gray-200  shadow-lg rounded-lg overflow-hidden">
                                <thead className="bg-zinc-500">
                                    <tr>

                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Contact</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">status</th> */}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">

                                    {EnrolledStudents.map((student: any, index) => (
                                        <tr key={student?._id}>
                                            <td className="px-6 py-4 text-zinc-900 font-sans font-semibold text-sm whitespace-nowrap">{index + 1}</td>
                                            {student?.profileImage ? (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "><img src={student.profileImage} className="w-8 h-8 rounded-full" alt="" /></th>

                                            ) : (
                                                <th className="px-6 py-3 text-xs font-medium text-white uppercase">
                                                    <p className="w-8 h-8 flex items-center justify-center bg-black rounded-full">
                                                        <FaUser />
                                                    </p>
                                                </th>)}
                                            <td className="px-6 py-4 text-zinc-900 font-sans font-semibold whitespace-nowrap text-sm">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold">{student.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap  font-mono">{student.contact}</td>
                                            {/* <td className="px-6 py-4 whitespace-nowrap"><button id="block" className="w-20 h-8 bg-gradient-to-r from-buttonGreen via-green-700 to-green-900 hover:text-black hover:bg-white hover:border-2 hover:border-buttonGreen rounded-full text-white " >Details</button></td> */}
                                        </tr>
                                    ))}

                                </tbody>
                            </table>


                        ) : (

                            <div>
                                <p className="flex justify-center items-center font-semibold">{isLoading ? 'Students data is loading..........' : 'No students enrolled'}</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}