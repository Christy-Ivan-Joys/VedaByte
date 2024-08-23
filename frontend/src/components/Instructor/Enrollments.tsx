import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { FaSearch } from "react-icons/fa"
import { Pagination, Stack } from "@mui/material"
import { useFetchDataForDashboardMutation } from "../../utils/redux/slices/instructorApiSlices"
import { useEffect, useState } from "react"
import { useErrorHandler } from "../../pages/Instructor/ErrorBoundary"

const Enrollments = () => {

    const [fetchDataForDashboard] = useFetchDataForDashboardMutation()
    const [enrollmentDetails, setEnrollmentDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const handleError = useErrorHandler()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const data = await fetchDataForDashboard(undefined).unwrap()
                console.log(data)
                setEnrollmentDetails(data.enrollmentDetails)
                setIsLoading(false)
            } catch (error: any) {
                handleError(error.data.message)
            }
        }
        fetchData()
    }, [])
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
                    <div className="w-screen/2 border-t border-gray-500 m-5"></div>
                    {enrollmentDetails.length ? (

                        <table className="table-auto min-w-full divide-y divide-gray-200  shadow-lg rounded-lg overflow-hidden">
                            <thead className="bg-zinc-500">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                {enrollmentDetails.map((enrollment: any, index) => (
                                    <tr key={enrollment?.studentId}>
                                        <td className="px-6 py-4 text-zinc-900 font-sans font-semibold text-sm whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">
                                            <img
                                                src={enrollment?.courseImage}
                                                className="w-20  rounded-md object-cover"
                                                alt={enrollment?.title}
                                            />
                                        </td>                                        <td className="px-6 py-4 text-zinc-900 font-sans font-semibold whitespace-nowrap text-sm">{enrollment?.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">{enrollment?.studentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap  font-mono">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
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
                    <Stack spacing={2} className="pagination-container flex justify-center gap-2 font-semibold mb-4 mt-3  items-center">
                        <Pagination
                            color="standard"
                            // count={pages}
                            shape="rounded"
                        // page={currentPage}
                        // onChange={(_,value)=>setCurrentPage(value)}
                        />
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default Enrollments
