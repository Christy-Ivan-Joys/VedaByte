import { useEffect, useState } from "react"
import { Sidebar } from "./Sidebar"
import { useChangestatusMutation, useStudentsMutation } from "../../utils/redux/slices/adminApiSlices"
import { Student } from "../../types"
import { useNavigate } from "react-router-dom"
import {FaSearch} from "react-icons/fa"
import { useErrorHandler } from "./ErrorBoundary"
import { useDispatch } from "react-redux"
import { setAdmin } from "../../utils/redux/slices/adminAuthSlice"
import Header from "./Header"
export function Students() {
    const [students] = useStudentsMutation()
    const [changestatus] = useChangestatusMutation()
    const [block, setStatus] = useState(false)
    const [data, setData] = useState<Student[]>([])
    const [filteredData, setfilteredData] = useState<Student[]>([])
    const handleError = useErrorHandler()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const changeStatus = async (id: string, status: string) => {
        try {
            const role = 'Student'
            const data = { id, role, status }

            await changestatus(data).unwrap()
            setStatus(!block)


        } catch (error) {

        }


    }
    const handleFilter = (value: string) => {
        console.log(value)
        if (!value) {
            setfilteredData(data)
            return
        }

        const regex = new RegExp(value, 'i')
        const filtered = data.filter((elem) => {
            console.log(elem)
            return regex.test(elem.name) || regex.test(elem.email) || regex.test(elem.contact) || regex.test(elem.status)
        })
        console.log(filteredData)
        setfilteredData(filtered)
    }

    useEffect(() => {

        const fetchStudents = async () => {
            try {

                const data = await students(undefined).unwrap()
                setData(data)
                setfilteredData(data)

            } catch (error: any) {
                console.log(error, 'error')
                handleError(error?.data?.message)
            }
        }
        fetchStudents()
    }, [block])

    const handleLogout = () => {
        dispatch(setAdmin(null))
        localStorage.removeItem('token')
        navigate('/admin/login')
    }
    
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
                <Header />
                <div className="overflow-x-auto p-10 mt-10 bg-gray-300 shadow-xl rounded-lg  ">
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

                    <table className="table-auto min-w-full divide-y divide-gray-200  shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-zinc-500">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase "></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((student, index) => (
                                <tr key={student._id}>
                                    <td className="px-6 py-4 text-zinc-900 font-sans font-semibold text-sm whitespace-nowrap">{index + 1}</td>
                                    <img src={student.profileImage} className="w-10 mt-2 flex justify-center items-center h-10 border-2 rounded-full" alt="" />
                                    <td className="px-6 py-4 text-zinc-900 font-sans font-semibold whitespace-nowrap text-sm">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">{student.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap  font-mono">{student.contact ? student.contact : 'nil'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => changeStatus(student._id, student.status)} id="block" className={`${student.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}  px-5  bg-black rounded-full border-2 `}>{`${student.status === 'Active' ? 'block' : 'unblock'}`}</button></td>
                                </tr>

                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}