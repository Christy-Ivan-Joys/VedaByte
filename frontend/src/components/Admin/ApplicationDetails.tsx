import { Sidebar } from "./Sidebar"
import { Link, useParams } from "react-router-dom"
import { FaSignOutAlt } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useApplicationsMutation } from "../../utils/redux/slices/adminApiSlices"
import { toast } from "react-toastify"
import { Application } from "../../types"
export const ApplicationDetails = () => {

    const [details, setDetails] = useState<Application | null>()
    const [applications] = useApplicationsMutation()
    const { _id } = useParams()
    console.log('application', _id)
    useEffect(() => {

        const fetchApplications = async () => {
            try {

                const data = await applications(undefined).unwrap()
                console.log(data, 'detail')
                if (data.length) {
                    data.map((item: Application) => {
                        if (item._id === _id) {
                            if (item) {
                                setDetails(item)
                            }

                        }
                    })
                    console.log(details, 'detailsssss')
                }

            } catch (error: any) {
                if (error.message === 'No applications found') {
                    toast.error('no applications to show')
                } else if (error.message === 'Internal server error') {

                }
            }

        }
        fetchApplications()
    }, [_id, setDetails])



    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
                <div className="w-screen/2  h-14 rounded-lg shadow-lg justify-between items-center p-3 flex">
                    <h1 className="ml-3 text-lg  text-black font-bold text-1xl">Course application details</h1>
                    <div className=" flex justify-center items-center">
                        <img src="" className="justify-end border-8 border-blue-900 w-8  mr-5 rounded-full h-8 " alt="" />
                        <Link to="/logout" className="flex">
                            <FaSignOutAlt />logut
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto p-10 mt-2 bg-gray-100    shadow-xl rounded-lg border-2  ">
                    <div >
                    <div className=" flex justify-end items-end">
                            <button className="bg-cyan-500 w-24 h-8 rounded-2xl text-white text-sm font-semibold">Approve</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 px-32">
                            <div className="flex flex-col py-1">
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Course Name :{details?.name} </label>
                            </div>
                            <div className="flex flex-col py-1">
                                <label className="text-md font-semibold text-black" htmlFor="lastname">Category : {details?.category} </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 px-32">
                            <div className="flex flex-col py-1">
                                <label className=" text-gray-800 text-md font-semibold" htmlFor="firstname">Description :{details?.description} </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 p-3 px-32">
                            <div className="flex flex-col py-1">
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Price : {details?.price} </label>
                            </div>
                            <div className="flex flex-col py-1">
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Thumpnail Image: </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 p-3 px-16">
                            <div className="flex py-1 gap-5">

                                <img src="" className="w-10 h-10 rounded-full" alt="" />
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Instructor : {details?.InstructorId.name}</label>
                            </div>
                            <div className="flex flex-col py-1">
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Email: {details?.InstructorId.email} </label>
                            </div>
                            <div className="flex flex-col py-2 px-14">
                                <label className=" text-black text-md font-semibold" htmlFor="firstname">Contact: {details?.InstructorId.contact} </label>
                            </div>
                        </div>
                        {details?.module.map((item,index) => (
                            <div>
                                <div className=" flex px-32 mt-5">

                                    <label htmlFor="" className="text-center font-bold text-lg">Section-{`${index+1}`}</label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 p-3 px-32">

                                    <div className="flex flex-col py-1">
                                        <label className=" text-black text-md font-semibold" htmlFor="firstname">Title:{item.title} </label>
                                    </div>
                                    <div className="flex flex-col py-1">
                                        <label className=" text-black text-md font-semibold" htmlFor="firstname">Description:{item.description}</label>
                                    </div>
                                    <div className="flex flex-col py-1">
                                        <label className=" text-black text-md font-semibold" htmlFor="firstname">Section video {item.videoURL}</label>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}