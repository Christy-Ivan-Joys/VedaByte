import { Sidebar } from "./Sidebar"
import '../../styles/Dashboard.css'
import { useChangestatusMutation, useTutorsMutation } from "../../utils/redux/slices/adminApiSlices"
import { useEffect, useState } from "react"
import { Tutor } from "../../types"
import {  FaSearch } from "react-icons/fa"
import Header from "./Header"



export function Tutors() {

    const [tutors] = useTutorsMutation()
    const [data, setData] = useState<Tutor[]>([])
    const [filteredData, setfilteredData] = useState<Tutor[]>([])
    const [changestatus] = useChangestatusMutation()
    const [block, setStatus] = useState(false)
    const handleChange = async (id: string, status: string) => {
        const role = 'tutor'
        const data = { id, role, status }
        await changestatus(data).unwrap()
        setStatus(!block)
    }

    const handleFilter = (value: any)=> {
           if(!value){
            setfilteredData(data)
            return
           }
           const letter = new RegExp(value,'i')
        const filtered = data.filter((elem:any) => {
          return  letter.test(elem.name) || letter.test(elem.email) || letter.test(elem.contact) || letter.test(elem.status)
        })
       
        setfilteredData(filtered)

    }

    useEffect(() => {
        const fetchTutors = async () => {
            const data = await tutors(undefined).unwrap()
            setData(data)
            setfilteredData(data)
        }
        fetchTutors()
    }, [block])

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
             <Header/>
                <div className="overflow-x-auto p-10 mt-10 bg-gray-300 shadow-xl rounded-lg ">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase ">Block / unblock</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((tutor, index) => (
                                <tr key={tutor._id}>
                                    <td className="px-6 py-4 text-zinc-900 font-sans font-semibold text-sm whitespace-nowrap">{index + 1}</td>
                                    <img src={tutor?.profileImage} className="w-10 mt-2 flex justify-center items-center h-10 border-2 rounded-full" alt="" />
                                    <td className="px-6 py-4 text-zinc-900 font-sans font-semibold whitespace-nowrap text-sm">{tutor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">{tutor?.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap  font-mono">{tutor?.contact ? tutor?.contact : 'nil'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">{tutor?.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => handleChange(tutor?._id, tutor?.status)} id="block" className={`${tutor?.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}  px-5  bg-black rounded-full border-2 `}>{`${tutor?.status === 'Active' ? 'block' : 'unblock'}`}</button></td>
                                </tr>

                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}