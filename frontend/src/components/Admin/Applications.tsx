import { Sidebar } from "./Sidebar"
import { FaSearch } from "react-icons/fa"
import { useApplicationsMutation } from "../../utils/redux/slices/adminApiSlices"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { ApplicationCard } from "./ApplicationCard"
import Header from "./Header"


export const Applications = () => {
    const [applications] = useApplicationsMutation()
    const [courseApplications,setCourseApplications]= useState([])

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await applications(undefined).unwrap()
                console.log(data,'dataaaaa')
                setCourseApplications(data)
            } catch (error: any) {
                if (error.message === 'No applications found') {
                    toast.error('no applications to show')
                } else if (error.message === 'Internal server error') {

                }
            }
        }
        fetchApplications()
    }, [])

    const handleFilter = (letter:string) => {
           console.log(letter)
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
             <Header/>
                <div className="overflow-x-auto p-10 mt-2 bg-gray-300 shadow-xl rounded-lg border-2  ">
                    <div className="px-8 p-5 flex justify-between items-center">
                        <div className="flex gap-5">
                            <button className="bg-black text-white text-md font-semibold w-28 rounded-md h-8">Pending<span className="bg-white w-2 h-2 text-sm text-black ml-2 px-2 rounded-md ">7</span></button>
                            <button className="bg-black text-white text-md font-semibold w-24 rounded-md h-8">Approved</button>
                            <button className="bg-black text-white text-md font-semibold w-24 rounded-md h-8">Rejected</button>
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
                    <ApplicationCard Applications ={courseApplications}/>
                    
                </div>
            </div>
        </div>
    )
}