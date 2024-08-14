
import { Sidebar } from "./Sidebar"


import { Link } from "react-router-dom"
import { FaSignOutAlt, FaSearch } from "react-icons/fa"
export function Notifications() {
    const handleFilter = (letter:string) => {

         console.log(letter)
    }

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="content">
                <div className="w-screen/2  h-14 rounded-lg shadow-lg justify-between items-center p-3 flex">
                    <h1 className="ml-3 text-lg  text-black font-bold text-1xl">Notifications</h1>
                    <div className=" flex justify-center items-center">
                        <img src="" className="justify-end border-8 border-blue-900 w-8  mr-5 rounded-full h-8 " alt="" />
                        <Link to="/logout" className="flex">
                            <FaSignOutAlt />logut
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto p-10 mt-10 bg-gray-300 shadow-xl rounded-lg border-2">
                    <div className="px-8 p-5 flex justify-between items-center">
                        <div className="flex gap-5">
                            <button className="bg-black text-white text-md font-semibold w-20 rounded-md h-8">All<span className="bg-white w-2 h-2 text-sm text-black ml-2 px-2 rounded-md ">7</span></button>
                            <button className="bg-black text-white text-md font-semibold w-20 rounded-md h-8">Read</button>
                        </div>
                        <div className="relative w-72">
                            <input
                                type="text"
                                className="w-full h-10 pl-10 pr-4 rounded-3xl shadow focus:outline-none"
                                placeholder="Search"
                                onChange={(e) => handleFilter(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-black pointer-events-none">
                                <FaSearch/>
                            </div>
                        </div>
                    </div>
                    <div className="w-screen/2 border-t border-gray-500"></div>
                </div>
            </div>
        </div>
    )
}